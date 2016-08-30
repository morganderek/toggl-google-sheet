var SHT_CONFIG = 'Config';

function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [ {name: "Get Timesheet for Month", functionName: "action"}                  ];
  ss.addMenu("Toggl", menuEntries);
}

function action() {

  var config = loadConfiguration(SpreadsheetApp.getActive(), SHT_CONFIG);

  var timeZone = Session.getScriptTimeZone();
  Logger.log("script time zone: " + timeZone);

  var timesheetDate = config.timesheetDate;
  Logger.log("start date: " + timesheetDate);
  var startDate = new Date(timesheetDate.getYear(), timesheetDate.getMonth(), 1);
  var since = Utilities.formatDate(startDate, timeZone, "yyyy-MM-dd");
  Logger.log("since: " + since);

  var days = daysOfMonth(startDate.getYear(), startDate.getMonth());

  var endDate = new Date(startDate.getYear(), startDate.getMonth(), days);
  Logger.log("end date: " + endDate);
  var until = Utilities.formatDate(endDate, timeZone, "yyyy-MM-dd");
  Logger.log("until: " + until);


  var timesheet = fetchTimesheet(config.apiToken, config.workspaceId, since, until);
  createTimesheet(startDate, timeZone, timesheet);
}

function fetchTimesheet(apiToken, workspaceId, since, until) {

  var timesheet = [];

  var report = fetchReport(apiToken, workspaceId, since, until);
  Logger.log("total count: " + report.total_count + " - per page: " + report.per_page);
  var numberOfPages = Math.ceil(report.total_count/ report.per_page);
  Logger.log("number of pages: " + numberOfPages);
  var page = 1;
  var count=1;
  do {
    for (var i = 0; i < report.data.length; i++) {
      var timeEntry = report.data[i];
      var client = timeEntry.client;
      var start = parseISODateTime(timeEntry.start);
      var duration = timeEntry.dur;
      var description = timeEntry.description;
      var user = timeEntry.user;

      Logger.log("add " + start.getDate() + " to timesheet");
      timesheet[count] = {date:start.toDateString(),client:client,duration:duration,description:description,user:user};
      count++;
    }

    ++page;
    report = fetchReport(apiToken, workspaceId, since, until, page);
  } while (page <= numberOfPages);

  return timesheet;
}

function createTimesheet(startDate, timeZone, timesheet) {

  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = Utilities.formatDate(startDate, timeZone, "yyyyMM");

  var sheet = activeSpreadsheet.getSheetByName(sheetName);
  if (sheet) {
    activeSpreadsheet.deleteSheet(sheet);
  }

  var sheet = activeSpreadsheet.insertSheet(sheetName, activeSpreadsheet.getSheets().length);

  var titles = sheet.getRange(1, 1, 1, 5);
  titles.setValues([["Date", "Who","Customer", "Duration", "Description"]]);
  titles.setFontWeights([["bold", "bold", "bold", "bold", "bold"]]);

  var row = 2
  for (var i = 1; i < timesheet.length; i++) {
    var entry = timesheet[i];
    
    var hours = millisToDecimalHours(entry.duration);
    hours = Math.round(hours * 100) / 100;
    sheet.getRange(row, 1, 1, 5).setValues([[entry.date, entry.user, entry.client, hours, entry.description]]);
    sheet.getRange(row, 1).setNumberFormat("dd/MM/yyyy")
    ++row;
  }

  sheet.autoResizeColumn(1);
  sheet.autoResizeColumn(2);
  sheet.autoResizeColumn(3);
  sheet.autoResizeColumn(5);
}

// based on the blog post "Insider Tips for using Apps Script and Spreadsheets"
// from the Google Apps Developer Blog
// http://googleappsdeveloper.blogspot.be/2012/05/insider-tips-for-using-apps-script-and.html
function loadConfiguration(wb, configSheet) {

  Logger.log("Loading configuration ...");

  var configsheet = wb.getSheetByName(configSheet);
  var result = new Array();

  var cfgdata = configsheet.getDataRange().getValues();
  for (i = 1; i < cfgdata.length; i++) {
    var key = cfgdata[i][0];
    var value = cfgdata[i][1];

    Logger.log("key: " + key + " - value: " + value);

    result[key] = value;
  }

  return result
}
