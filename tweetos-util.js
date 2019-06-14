/**
 * Built based on: 
 *      Article: https://medium.com/javascript-in-plain-english/i-made-a-twitter-bot-from-nothing-but-a-google-sheet-ef0ba6e1b194
 *      Code sample: https://gist.github.com/PeterBerthelsen/72e74401dea8a6a3230d1680db642984 
 * This is a first practice at using GAS ans twitter API trought the Twitterlib Library provided in the README file.
 */

function sendTweet(TweetText, IdInResponseTo, imageItems) {
  //New Properties Service
  var props = PropertiesService.getScriptProperties();                                      
  //Pass Authentication through Service
  props.setProperties(twitterKeys);                                                         
  //Array for params (reply, images, etc)
  var params = new Array(0);                                                               
  //Attempt Connection with Service
  var service = new Twitterlib.OAuth(props);                                                   
  //log function start
  Logger.log("sendTweet Initiated!");                                                      
  //log params passed through function
  Logger.log("using params:" +                                                              
             "\n TweetText: " + TweetText +
             "\n| IdInResponseTo: " + IdInResponseTo +
             "\n| imageItems: " + imageItems);  
  
  //If credentials do NOT grant access...
  if (!service.hasAccess()) {                                                               
    //log authentication failure and end.
    Logger.log("Authorization Failed");
    return 0;
  }                                                                                     
  //log authentication success
  Logger.log("Authentication Successful");                                               
  //Tweet text
  var status = TweetText;                                                                   
  
  //If no reply is provided...
  if (IdInResponseTo == 0 || IdInResponseTo == null) {
    Logger.log("No reply ID provided.");
    //If Reply (or thread) is set up...
  } else {
    //variable for replies, passed to .sendTweet
    var ReplyId = IdInResponseTo;                                                           
    //log response to  
    Logger.log("In response to: " + ReplyId);                                              
    //send with reply
    params.in_reply_to_status_id = ReplyId;                                                 
    //auto-mentions previous user (for thread)
    params.auto_populate_reply_metadata = true;                                             
  };
  
  try {
    if (imageItems == 0 || imageItems == null) {                                                                           
      Logger.log("No images detected!");
    } else { 
      //IDs for uploads, will be CSVs
      var mediaId = new Array(0);
      var imgs = imageItems;                                            
      Logger.log(imgs.length + " images detected!");
      
      for (var i in imgs){
        Logger.log("processing upload: " + imgs[i].getName());
        //Get URL and convert to Blob format
        var blob = imgs[i];
        //set imageID variable to pass through .uploadMedia
        var imageId = service.uploadMedia(blob);                                          
        if (imageId) {
          if (i == 0) {//If it's the first image. get media ID (used to tweet image)                                                                   
            mediaId = mediaId + imageId.media_id_string;
          } else if (i < 4) {//If it's the second, third, or fourth image get media ID
            mediaId = mediaId + "," + imageId.media_id_string;
            Logger.log(imageId.media_id_string + " uploaded");
          } else {//If 4 images have already been added to mediaId...                                                                    
            Logger.log("Maximum Image (4) already attached! " + imageId.media_id_string + " NOT included");
          }
        } else {
          Logger.log("Image upload FAILED!");
        };
      }
      //Log number of successful uploads
      Logger.log("MEDIA ID(s): " + mediaId);
      //set media_ids to string value containing uploaded IDs
      params.media_ids = mediaId;
    };
    
    //attempt to send tweet
    var response = service.sendTweet(status, params);                                     
    if (response) {                                                                        
      Logger.log("Posted Tweet ID: " + response.id_str);
      //return tweet ID (useful for threads & logs)
      return (response.id_str);                                                           
    } else {
      Logger.log("No Response");
    }; 
  } catch (e) {
    Logger.log("Error: ");
    Logger.log(e);          
  }
}