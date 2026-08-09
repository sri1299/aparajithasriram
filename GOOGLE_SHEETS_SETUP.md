# Connect the RSVP form to Google Sheets

1. Create a Google Sheet and name its first tab `RSVPs`.
2. In that sheet, choose **Extensions → Apps Script**. Replace its contents with this code:

```javascript
const SHEET_NAME = 'RSVPs';

function doPost(e) {
  const data = JSON.parse(e.postData.contents || '{}');
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  sheet.appendRow([
    new Date(),
    data.name || '',
    data.phone || '',
    data.guests || '',
    data.attendance || '',
    data.message || ''
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Deploy → New deployment**, select **Web app**, then set **Who has access** to **Anyone**. Deploy and authorize it.
4. Copy the deployment URL ending in `/exec`.
5. In `index.html`, paste it into `data-sheet-endpoint` on the `rsvp-form` element.

The sheet will receive: timestamp, name, mobile, number attending, response, and message.
