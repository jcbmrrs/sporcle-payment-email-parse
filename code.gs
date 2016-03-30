function parseSporcleReceiptMessages(start) {
 
  start = start || 0;
 
  // Get the message threads labeled with "Sporcle/Payment"
  var label = GmailApp.getUserLabelByName("Sporcle/Payment");
  var threads = label.getThreads();
  // Access to the current Spreadsheet for writing out data
  var sheet = SpreadsheetApp.getActiveSheet().getSheetByName("All Games");
  
  for (var i = 0; i < threads.length; i++) {
    // Get the first email message of a threads
    var tmp,
    message = threads[i].getMessages()[0],
    // Get the plain text body of the email message
    content = message.getPlainBody();
    if(content) {
      // Parse using regular expressions for game 1 teams and players and log results
      tmp = content.match(/Game 1: \d{1,2} players on \d{1,2}/g);
      if(tmp != null){
        var game1players = tmp.toString().replace(/Game 1: /g, "").replace(/ players on \d{1,2}/g, "").replace(/[^0-9,\.]/g, "");
        var game1teams = tmp.toString().replace(/Game 1: \d{1,2}/g, "").replace(/ players on /g, "").replace(/[^0-9,\.]/g, "");
        Logger.log(game1players);
        Logger.log(game1teams);
      }
      // Parse using regular expressions for game 2 teams and players and log results
      var tmp2 = content.match(/Game 2: \d{1,2} players on \d{1,2}/g);
      if(tmp2 != null){
        var game2players = tmp2.toString().replace(/Game 2: /g, "").replace(/ players on \d{1,2}/g, "").replace(/[^0-9,\.]/g, "");
        var game2teams = tmp2.toString().replace(/Game 2: \d{1,2}/g, "").replace(/ players on /g, "").replace(/[^0-9,\.]/g, "");
        Logger.log(game2players);
        Logger.log(game2teams);
      }
      // Parse using regular expressions for payment amount and location and log results
      var pay = content.match(/\$\d{1,3}.\d\d/g);
      Logger.log(pay);
      var loc = content.match(/show at .* on \d{1,2}\/\d{1,2}\/\d{4}/g);
      if(loc != null){
        var locale = loc.toString().replace(/show at /g, "").replace(/ in .* on \d{1,2}\/\d{1,2}\/\d{4}/g, "");
        Logger.log(locale);
      }
      // Parse for date and log result
      var date = loc.toString().replace(/show at .* on /g, "");
      Logger.log(date);
      // Add rows of data to Spreadsheet
      sheet.appendRow([date, game1players, game1teams, game2players, game2teams, pay.toString(), locale]);
      // Remove label to ensure one-time processing
      threads[i].removeLabel(label);
    } // End if loop
  } // End for loop 
}
