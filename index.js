//Celt report sprdsht coordinate
var ss = SpreadsheetApp.openById("SPREADSHEET_ID"),
    sht1 = ss.getSheetByName("Set n Manage"),
    sht2 = ss.getSheetByName("Overview"),
    sht3 = ss.getSheetByName("Temp_rep");

//Twitter Authentication Tokens to pass through props
  var twitterKeys = {
    TWITTER_CONSUMER_KEY: "[YOUR KEY HERE]",
    TWITTER_CONSUMER_SECRET: "[YOUR SECRET HERE]",
    TWITTER_ACCESS_TOKEN: "[YOUR TOKEN HERE]",
    TWITTER_ACCESS_SECRET: "[YOUR SECRET HERE]"    
  };

function reportTweeter() { 
//  Logger.log(getChartsData(sht2));
  var TweetText = "",
      IdInResponseTo = "",
      ImageItems = [];
  
  //Build Tweet
  TweetText = "     --- CELT Daily update ---  \n" +
              "Balance ETH equivalent: " + sht2.getRange("fix_qv_actualEtheq").getValue() + "\n"+
              "Daily P/L: " + sht2.getRange("fix_qv_PL").getValue() + "\n"+
              "P/L %: " + sht2.getRange("fix_qv_PLperc").getValue() + "\n"+
              "Delta: " + sht2.getRange("fix_qv_delta").getValue() + "\n"+
              "Fund Fiat value: " + sht2.getRange("fix_qv_fiatEq").getValue() + "\n"+
              "For more information Checkout! \n" + 
              sht2.getRange("fix_qv_officialSite").getValue() + "\n"+
              "#COSS #CELT #Cryptocurrency $coss";

  //Add images
  ImageItems.push(getChartImage(getChartByProp(sht2, "options.title", "Last report pie chart"),"Balance % pie"));
  
  
  var response = sendTweet(TweetText, IdInResponseTo, ImageItems);
  Logger.log(response);
}



