# sporclePaymentEmailParse
Sporcle Live Trivia Host email parsing tool for automatic extraction of payment, player count and team count details.
Requires use of GMail, Google Sheets and this Google Apps Script.

## INSTALLATION INSTRUCTIONS:

1. Create GMail filter
  - `Matches: subject:(submittal receipt confirmation)`
  - `Do this: Apply label "Sporcle/Payment"`
2. Create Google Sheet with the following columns:
  - Date
  - Game 1 Players
  - Game 1 Teams
  - Game 2 Players
  - Game 2 Teams
  - Total Payment
  - Location
3. Copy and paste code below into Script
  - Access in Google Sheet under `Tools > Script Editor`
4. Run from Script Editor
  - `Run > parseSporcleReceiptMessages`
  - OR use the triangular "Run" logo in the menu bar - looks like a Play control for media
5. Profit (or at least understand your pay better)

### Notes:
Created by Jacob A. Morris (jcbmrrs). 
Borrows from http://ctrlq.org/code/20019-parse-gmail-extract-data as the starting point.
