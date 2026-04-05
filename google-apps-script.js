/**
 * Google Apps Script — Church Visitor Response Form Handler
 *
 * SETUP:
 * 1. Open Google Sheets → Extensions → Apps Script
 * 2. Paste this entire file into the editor
 * 3. Click Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the deployment URL into your .env.local as NEXT_PUBLIC_GOOGLE_SCRIPT_URL
 *
 * SHEET COLUMNS (auto-created on first submission):
 * A: Timestamp | B: First Name | C: Phone | D: Describes | E: Other | F: Prayer Request | G: Submitted At
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "First Name",
        "Phone",
        "Describes",
        "Other",
        "Prayer Request",
        "Submitted At",
      ]);
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date().toISOString(),
      data.firstName || "",
      data.phone || "",
      data.describes || "",
      data.other || "",
      data.prayerRequest || "",
      data.submittedAt || "",
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "ok" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ status: "ok", message: "Church visitor form endpoint is live." })
  ).setMimeType(ContentService.MimeType.JSON);
}
