
  // Get the current day and time
    var times = function() {
      
      // new date object  
        var currentTime = new Date();

     // FInd out what day it is.  Post array starts on Monday but JS array starts on Sunday
         if (currentTime.getDay() == 0) {
          today = 6;
         } else {
          today = currentTime.getDay() - 1;
         };

         var cHour = currentTime.getHours();
         var cMin = currentTime.getMinutes();
         var fullTime = cHour+':'+cMin
          
      // Post days array starts on Monday                  
         return {day: today, timeRigtNow: fullTime};
    };

 // This function works out whether the postal service is open or closed
    var checkClosed = function(today, model) {
                         
          var getHours = model.toJSON().hours[today];

          // If today has any opening / closing hours associated with it
            if ( getHours != undefined ) {                           
              
              // Hours are defined, however the array may be empty 
                if(getHours.close != undefined) {                   
                  // Get the closing time for today
                    var closingTime = getHours.close; 
                    var openTime = getHours.open; 
                    var todaysOpeningTime = toDate(openTime,"h:m");
                    var todaysClosingTime = toDate(closingTime,"h:m");
                  // Get current time   
                    var currentTime = times().timeRigtNow;
                    var curTime = toDate(currentTime,"h:m")
                    //console.log(curTime)
                  // Return whether the place is open or not    
                    if (curTime > todaysClosingTime || curTime < todaysOpeningTime  ) {
                      // CLosed                      
                      return false                  
                    } else {
                      // Open
                      return true;                      
                    };                
              // Closed is defined so the shop is closed     
                } else if(getHours.closed != undefined) {                
                 return false;
                // Array is defined but no values 
                } else {                 
                 return true;
                }
          // Else if no hours were defined but closed was      
            } else {
                return true;                
            }
    };

  // Closed text and Opening hours
    var closedText = function(isOpenNow, model) {     
      if(isOpenNow) {
          if (model.toJSON().type.toLowerCase() === 'atm' ||  model.toJSON().type.toLowerCase() === 'postbox' ) {
            var closedInfo = '';
          } else {
            var closedInfo = 'Open from '+model.get("hours")[today].open+' - '+model.get("hours")[today].close + ' today'   
          }         
      // If its closed descide show whether its been closed all day or closed at a certian time
        } else {
          var closedInfo = 'Closed';                
        }
        return closedInfo;
    };

  // URL of item  
    var buildPlaceUrl = function(model) {
        var id = model.get('id');
        var docUrl = document.URL;
        var startOfString = docUrl.indexOf('locator/');
        var restOfString = docUrl.substring(0, startOfString + 8);
        var url = restOfString+'closest/'+id;
        return url;
    };

  // Distance in KM
    var calcDistance = function(model) {    
        var distance = model.get('distance_in_m');
        var distanceKM = parseFloat(distance/1000).toFixed(2);
        return distanceKM;
    };


// Create the Info Window for Google map
  var infowindowContent = function (model){
      
      // Find what day it is and whether the place is open or not
        var today = times().day;
        var isOpenNow = checkClosed( today, model );           
      
      // If the place is open show the opening times, however for ATM's & Postboxes dont show anything as they are always open
        var closedInfo = closedText(isOpenNow, model)

      // Work out more info URL
          var url = buildPlaceUrl(model);

      // Set distance   
          //console.log()
          if (model.get('distance_in_m') != undefined) {
            var distanceKM = calcDistance(model);      
          };
          
      // Create info window, this can be a combination of address, distance, opening hours and url        
          var infoWindowHtml = '';
          var header = model.get("type");
          var address = model.get("address");
          infoWindowHtml                                                            += '<div class="bubble">';
          if ( header != undefined &&  header.length > 0 )     { infoWindowHtml     += '<h2>'+header+'</h2>'};          
          if ( address != undefined &&  address.length > 0 )    { infoWindowHtml    += '<ul><li>'+address+'</li>'};  
          if ( distanceKM != undefined &&  distanceKM.length > 0 ) { infoWindowHtml += '<li>Distance: '+distanceKM+'km</li>'};  
          if ( closedInfo != undefined && closedInfo.length > 0 ) { infoWindowHtml  += '<li>'+closedInfo+'</li>' };        
          infoWindowHtml                                                            += '<li><a href="'+url+'">More info...</a></li></ul></div>';
      
          return infoWindowHtml;      
  };

// Create the Marker, this will be dependant on the time of day as to whether its a greyed out one.
var createMarker = function(model){
      
      // Find what day it is and whether the place is open or not
        var today = times().day;
        var isOpenNow = checkClosed( today, model ); 
      
      // If the place is open right now then display the full logo
        if (isOpenNow) {
          switch(model.get("type").toLowerCase()){
            case 'postshop':
            var pinImage = new google.maps.MarkerImage("./img/sprite.png",
                  new google.maps.Size(24, 36),
                  new google.maps.Point(0,25),
                  new google.maps.Point(10, 34));
              break;
            case 'postbox':
            var pinImage = new google.maps.MarkerImage("./img/sprite.png",
                  new google.maps.Size(24, 36),
                  new google.maps.Point(80,25),
                  new google.maps.Point(10, 34));
            break;
            case 'postbox lobby':
            var pinImage = new google.maps.MarkerImage("./img/sprite.png",
                  new google.maps.Size(24, 36),
                  new google.maps.Point(40,25),
                  new google.maps.Point(10, 34));

            break;
            case 'atm':
            var pinImage = new google.maps.MarkerImage("./img/sprite.png",
                  new google.maps.Size(24, 36),
                  new google.maps.Point(256,25),
                  new google.maps.Point(10, 34));            
            break;
            default:
            var pinImage = new google.maps.MarkerImage("./img/sprite.png",
                  new google.maps.Size(24, 36),
                  new google.maps.Point(0,25),
                  new google.maps.Point(10, 34));
          };
          return pinImage;
      //Otherwise display the greyed out logo 
        } else {

          switch(model.get("type").toLowerCase()){
            case 'postshop':
            var pinImage = new google.maps.MarkerImage("./img/sprite.png",
                  new google.maps.Size(24, 36),
                  new google.maps.Point(0,64),
                  new google.maps.Point(10, 34));
              break;
            case 'postbox':
            var pinImage = new google.maps.MarkerImage("./img/sprite.png",
                  new google.maps.Size(24, 36),
                  new google.maps.Point(80,64),
                  new google.maps.Point(10, 34));
            break;
            case 'postbox lobby':
            var pinImage = new google.maps.MarkerImage("./img/sprite.png",
                  new google.maps.Size(24, 36),
                  new google.maps.Point(40,64),
                  new google.maps.Point(10, 34));
            break;
            case 'atm':
            var pinImage = new google.maps.MarkerImage("./img/sprite.png",
                  new google.maps.Size(24, 36),
                  new google.maps.Point(256,64),
                  new google.maps.Point(10, 34));
            break;
            default:
            var pinImage = new google.maps.MarkerImage("./img/sprite.png",
                  new google.maps.Size(24, 36),
                  new google.maps.Point(0,64),
                  new google.maps.Point(10, 34));
          }

          return pinImage;

      }
}

