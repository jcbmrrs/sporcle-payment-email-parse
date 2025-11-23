/**
 * Parses Sporcle receipt emails and extracts payment, player, and team data to a Google Sheet.
 * Processes emails labeled with "Sporcle/Payment" and automatically populates the "All Games" sheet.
 *
 * The function extracts:
 * - Date of the show
 * - Game 1 and Game 2 player counts and team counts
 * - Payment amount
 * - Location
 * - Calculated fields (total players, average teams, per-player rate, etc.)
 *
 * @returns {void}
 */
function parseSporcleReceiptMessages() {
  // Configuration
  const LABEL_NAME = "Sporcle/Payment";
  const SHEET_NAME = "All Games";

  // Regular expression patterns
  const PATTERNS = {
    game1: /Game 1: \d{1,2} players on \d{1,2}/g,
    game2: /Game 2: \d{1,2} players on \d{1,2}/g,
    payment: /\$\d{1,3}\.\d{2}/g,
    location: /show at .* on \d{1,2}\/\d{1,2}\/\d{4}/g,
    date: /\d{1,2}\/\d{1,2}\/\d{4}/
  };

  try {
    // Get the message threads labeled with "Sporcle/Payment"
    const label = GmailApp.getUserLabelByName(LABEL_NAME);
    if (!label) {
      Logger.log(`Label "${LABEL_NAME}" not found. Please create the label first.`);
      return;
    }

    const threads = label.getThreads();
    if (threads.length === 0) {
      Logger.log("No threads found with the specified label.");
      return;
    }

    // Access the current Spreadsheet for writing out data
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      Logger.log(`Sheet "${SHEET_NAME}" not found. Please create the sheet first.`);
      return;
    }

    // Process each thread
    for (let i = 0; i < threads.length; i++) {
      try {
        // Get the first email message of a thread
        const message = threads[i].getMessages()[0];
        const content = message.getPlainBody();

        if (!content) {
          Logger.log(`Thread ${i + 1}: No content found, skipping.`);
          continue;
        }

        // Extract data using helper function
        const data = extractReceiptData(content, PATTERNS);

        // Validate that we have required data
        if (!data.date || !data.payment) {
          Logger.log(`Thread ${i + 1}: Missing required data (date or payment), skipping.`);
          continue;
        }

        // Get the next row number for formula references
        const row = sheet.getDataRange().getHeight() + 1;

        // Build formulas for calculated columns
        const formulas = buildFormulas(row);

        // Add row of data to Spreadsheet
        sheet.appendRow([
          data.date,
          data.game1players,
          data.game1teams,
          data.game2players,
          data.game2teams,
          data.payment,
          data.locale,
          formulas.totalPlayers,
          formulas.averageTeams,
          formulas.perPlayerRate,
          formulas.expectedPayment,
          formulas.difference
        ]);

        // Remove label to ensure one-time processing
        threads[i].removeLabel(label);
        Logger.log(`Thread ${i + 1}: Successfully processed.`);

      } catch (threadError) {
        Logger.log(`Error processing thread ${i + 1}: ${threadError.message}`);
        // Continue processing other threads
      }
    }

    Logger.log(`Processing complete. Processed ${threads.length} thread(s).`);

  } catch (error) {
    Logger.log(`Fatal error: ${error.message}`);
    throw error;
  }
}

/**
 * Extracts receipt data from email content using regex patterns.
 *
 * @param {string} content - The plain text email content
 * @param {Object} patterns - Object containing regex patterns
 * @returns {Object} Extracted data object
 */
function extractReceiptData(content, patterns) {
  const data = {
    game1players: "",
    game1teams: "",
    game2players: "",
    game2teams: "",
    payment: "",
    locale: "",
    date: ""
  };

  // Extract Game 1 data
  const game1Match = content.match(patterns.game1);
  if (game1Match) {
    const game1Text = game1Match[0];
    data.game1players = game1Text.replace(/Game 1: /g, "").replace(/ players on \d{1,2}/g, "").trim();
    data.game1teams = game1Text.replace(/Game 1: \d{1,2} players on /g, "").trim();
  }

  // Extract Game 2 data
  const game2Match = content.match(patterns.game2);
  if (game2Match) {
    const game2Text = game2Match[0];
    data.game2players = game2Text.replace(/Game 2: /g, "").replace(/ players on \d{1,2}/g, "").trim();
    data.game2teams = game2Text.replace(/Game 2: \d{1,2} players on /g, "").trim();
  }

  // Extract payment amount
  const paymentMatch = content.match(patterns.payment);
  if (paymentMatch) {
    data.payment = paymentMatch[0];
  }

  // Extract location and date
  const locationMatch = content.match(patterns.location);
  if (locationMatch) {
    const locationText = locationMatch[0];
    // Extract location name (everything between "show at " and " on ")
    data.locale = locationText.replace(/show at /g, "").replace(/ (?:in .* )?on \d{1,2}\/\d{1,2}\/\d{4}/g, "").trim();

    // Extract date
    const dateMatch = locationText.match(patterns.date);
    if (dateMatch) {
      data.date = dateMatch[0];
    }
  }

  return data;
}

/**
 * Builds formula strings for calculated columns.
 *
 * @param {number} row - The row number for cell references
 * @returns {Object} Object containing formula strings
 */
function buildFormulas(row) {
  return {
    // Total Players (Game 1 + Game 2)
    totalPlayers: `=SUM(B${row},D${row})`,

    // Average Teams
    averageTeams: `=AVERAGE(C${row},E${row})`,

    // Per Player Rate (Payment / Total Players)
    perPlayerRate: `=IF(H${row}=0,0,F${row}/H${row})`,

    // Expected Payment (Game1 Players * $3 + Game2 Players * $2) * 30%
    expectedPayment: `=(B${row}*3+D${row}*2)*0.3`,

    // Difference (Expected - Actual)
    difference: `=K${row}-F${row}`
  };
}
