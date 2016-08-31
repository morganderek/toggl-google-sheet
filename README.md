# Toggl Google Sheet

This Google Apps script imports time entries from Toggl.com into a Google Sheet using their [Detailed Report API](https://github.com/toggl/toggl_api_docs/blob/master/reports/detailed.md).

For a given month it displays in a sheet all your tasks. [Date - Who - Hours - Description]

## Installation

### Simple

Open [this Google Sheet](https://drive.google.com/open?id=1Aqlg4CXQZHHJcX6Zlknv7gzuMjKuzXmLzBMjqM66cFM) and make a copy in your Google Drive account.

### From scratch

Create a new Google Sheet.

Create a new script in your newly created Google Sheet and paste the contents of the files `Code.gs`, `Dates.gs` and `Toggl.gs` in their respective script files.

Edit `Toggl.gs` to fill in your *workspace_id* and *api_token*.

To figure out your *workspace_id*: go to Team in toggl.com. The number at the end of the URL is the workspace id.

To figure out your *api_token*: go to your Profile in toggl.com, your API token is at the bottom of the page.

## Usage
After a reopen of your Google Sheet you will have a new menu open called "*Toggl*" with a sub-menu "*Get Timesheet for Month*". 

Fill a date of the month you want to import in cell B1. So if you want your timesheet for December 2016, fill the date 01/12/2016 and click *Toggl > Get Timesheet for Month*.

## Acknowledgment
Credits go to [koen-github](https://github.com/koen-github) which provided an example on how to use the Toggl API with Google Sheet.

