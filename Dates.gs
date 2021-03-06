function daysOfMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function millisToDuration(millis) {
    var t = new Date(1970, 0, 1);
    t.setMilliseconds(millis);
    return t.toTimeString().substr(0, 8);
}

function millisToDecimalHours(millis) {
  return millis / 1000 / 60 / 60;
}

function parseISODateTime(isoDateTime) {
  try{
    var aDate = new Date();
    var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
        "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
        "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
    var d = isoDateTime.match(new RegExp(regexp));

    var offset = 0;
    var date = new Date(d[1], 0, 1);

    if (d[3]) { date.setMonth(d[3] - 1); }
    if (d[5]) { date.setDate(d[5]); }
    if (d[7]) { date.setHours(d[7]); }
    if (d[8]) { date.setMinutes(d[8]); }
    if (d[10]) { date.setSeconds(d[10]); }
    if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
    if (d[14]) {
      offset = (Number(d[16]) * 60) + Number(d[17]);
      offset *= ((d[15] == '-') ? 1 : -1);
    }

    offset -= date.getTimezoneOffset();
    time = (Number(date) + (offset * 60 * 1000));
    //time = Number(date);
    aDate.setTime(Number(time));
    return aDate;
  } catch(e){
    return;
  }
}

