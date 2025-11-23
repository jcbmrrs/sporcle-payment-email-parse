# Sporcle Payment Email Parser

**Automated payment tracking for Sporcle Live Trivia Hosts**

This Google Apps Script automatically parses Sporcle payment receipt emails and extracts key data (payment amount, player counts, team counts, location, and date) into a Google Sheet for easy tracking and analysis.

[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)

## Features

- 🔄 **Automated Processing**: Automatically processes payment receipt emails
- 📊 **Data Extraction**: Extracts date, location, payment, player counts, and team counts
- 📈 **Calculated Metrics**: Automatically calculates total players, average teams, per-player rate, and expected vs. actual payment
- ✅ **Error Handling**: Robust error handling with detailed logging
- 🏷️ **One-Time Processing**: Automatically removes labels after processing to prevent duplicates
- 📝 **Clean Code**: Modern JavaScript (ES6+) with comprehensive documentation

## Prerequisites

- Gmail account with Sporcle payment receipt emails
- Google Account with access to Google Sheets
- Google Apps Script (built into Google Sheets)

## What Gets Extracted

From each Sporcle payment receipt email:

| Data Field | Description |
|------------|-------------|
| **Date** | Date of the show |
| **Game 1 Players** | Number of players in the first game |
| **Game 1 Teams** | Number of teams in the first game |
| **Game 2 Players** | Number of players in the second game |
| **Game 2 Teams** | Number of teams in the second game |
| **Total Payment** | Payment amount received |
| **Location** | Venue name where the show took place |

### Automatically Calculated Columns

The script also adds these calculated columns:

| Column | Formula | Description |
|--------|---------|-------------|
| **Total Players** | `=SUM(Game1Players, Game2Players)` | Total players across both games |
| **Average Teams** | `=AVERAGE(Game1Teams, Game2Teams)` | Average number of teams |
| **Per Player Rate** | `=Payment / TotalPlayers` | Revenue per player |
| **Expected Payment** | `=(Game1Players×3 + Game2Players×2)×0.3` | Expected payment based on standard rates |
| **Difference** | `=ExpectedPayment - ActualPayment` | Variance between expected and actual |

## Installation

### Step 1: Set Up Gmail Filter

Create a Gmail filter to automatically label Sporcle payment emails:

1. In Gmail, click the search box and select "Show search options"
2. Enter the following:
   - **Subject**: `submittal receipt confirmation`
3. Click "Create filter"
4. Check "Apply the label" and choose "New label"
5. Name it: `Sporcle/Payment`
6. Click "Create filter"

### Step 2: Create Google Sheet

1. Create a new Google Sheet
2. Name the first sheet: `All Games`
3. Add the following column headers in Row 1:
   - A: **Date**
   - B: **Game 1 Players**
   - C: **Game 1 Teams**
   - D: **Game 2 Players**
   - E: **Game 2 Teams**
   - F: **Total Payment**
   - G: **Location**
   - H: **Total Players** (will auto-populate with formula)
   - I: **Average Teams** (will auto-populate with formula)
   - J: **Per Player Rate** (will auto-populate with formula)
   - K: **Expected Payment** (will auto-populate with formula)
   - L: **Difference** (will auto-populate with formula)

### Step 3: Add the Script

1. In your Google Sheet, click **Extensions > Apps Script**
2. Delete any existing code in the editor
3. Copy the entire contents of [`code.gs`](code.gs) from this repository
4. Paste it into the Apps Script editor
5. Click **File > Save** (or press `Ctrl+S` / `Cmd+S`)
6. Name your project (e.g., "Sporcle Parser")

### Step 4: Authorize the Script

1. In the Apps Script editor, select the function `parseSporcleReceiptMessages` from the dropdown
2. Click the **Run** button (▶️)
3. Review and authorize the permissions when prompted:
   - Read and modify your Gmail labels and messages
   - View and manage spreadsheets
4. Complete the authorization process

### Step 5: Run the Script

**Manual Execution:**
- In Apps Script editor: Click the **Run** button (▶️)
- View the execution log: **View > Logs** (or press `Ctrl+Enter`)

**Automatic Execution (Optional):**

Set up a trigger to run automatically:

1. In Apps Script editor, click the **Triggers** icon (⏰) in the left sidebar
2. Click **+ Add Trigger** (bottom right)
3. Configure:
   - **Function**: `parseSporcleReceiptMessages`
   - **Deployment**: Head
   - **Event source**: From spreadsheet
   - **Event type**: On open (or choose time-driven for scheduled runs)
4. Click **Save**

## Usage

### First Run

1. Make sure you have some emails with the `Sporcle/Payment` label
2. Run the script manually to test
3. Check the Google Sheet to verify data was extracted correctly
4. Check **View > Logs** in Apps Script for any errors or warnings

### Ongoing Use

Once set up:
- New payment emails will automatically get labeled by Gmail
- If you set up a trigger, the script runs automatically
- Otherwise, run the script manually whenever you want to process new emails
- Processed emails have the label removed to prevent re-processing

## Troubleshooting

### No Data Appears in Sheet

- **Check Gmail label**: Verify emails have the `Sporcle/Payment` label
- **Check sheet name**: Ensure the sheet is named exactly `All Games` (case-sensitive)
- **View logs**: In Apps Script, check **View > Logs** for error messages
- **Re-authorize**: Try running the script again to re-authorize permissions

### Script Errors

Common issues:

| Error | Solution |
|-------|----------|
| `Label "Sporcle/Payment" not found` | Create the Gmail label as described in Step 1 |
| `Sheet "All Games" not found` | Rename your sheet to exactly "All Games" |
| `Missing required data` | Email format may have changed; check logs for details |

### Partial Data Extraction

If some fields are empty:
- The email format may vary from expected patterns
- Check the Apps Script logs for details about what was extracted
- Email format changes may require regex pattern updates in the code

## Technical Details

### Code Improvements (v2.0)

This optimized version includes:

- ✅ Modern ES6+ JavaScript (`const`/`let` instead of `var`)
- ✅ Comprehensive JSDoc documentation
- ✅ Extracted regex patterns to constants for maintainability
- ✅ Proper error handling with try-catch blocks
- ✅ Input validation before processing
- ✅ Separated concerns with helper functions
- ✅ Fixed regex bugs (escaped decimal point in payment pattern)
- ✅ Null-safety checks to prevent runtime errors
- ✅ Detailed logging for troubleshooting
- ✅ Per-thread error handling to continue processing even if one email fails

### Dependencies

- **Gmail API**: Built into Google Apps Script
- **Spreadsheet API**: Built into Google Apps Script

No external libraries required.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the GNU General Public License v2.0 - see the [LICENSE](LICENSE) file for details.

## Credits

**Author**: Jacob A. Morris ([@jcbmrrs](https://github.com/jcbmrrs))

**Inspiration**: Based on concepts from [ctrlq.org/code/20019-parse-gmail-extract-data](http://ctrlq.org/code/20019-parse-gmail-extract-data)

## Changelog

### Version 2.0 (2025)
- Complete code refactor with modern JavaScript
- Added comprehensive error handling
- Improved regex patterns
- Added JSDoc documentation
- Created helper functions for better code organization
- Fixed decimal point bug in payment regex
- Added validation and null-safety checks

### Version 1.0 (Original)
- Initial release
- Basic email parsing functionality

## Support

If you encounter issues or have questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review the Apps Script execution logs
3. Open an issue on GitHub

---

**Note**: This tool is for Sporcle Live Trivia Hosts to track their payments. It is not affiliated with or endorsed by Sporcle.
