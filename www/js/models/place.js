
  nzp.Place = Backbone.Model.extend({

    defaults: { 
      apiKey:'a7f0c7b0b123012f06d2000c29b44ac0'
    },

    url: function(){
      return "http://api.nzpost.co.nz/locator/api/details?api_key=b2b736004873012e88a6442c03203548&id="+this.id+"&format=jsonp&callback=?&commit=Search"
    },

    getLatLng: function(){
      return new google.maps.LatLng(this.get("lat"),this.get("lng"));

    },

    // Get the current day and time
    times: function() {
      
      // new date object  
        var currentTime = new Date();

     // FInd out what day it is
         var today = currentTime.getDay();
         var cHour = currentTime.getHours();
         var cMin = currentTime.getMinutes();
         var fullTime = cHour+':'+cMin
      
      // Post days array starts on Monday                  
         return {day: today-1, timeRigtNow: fullTime};
    },
    
    // This function works out whether the postal service is open or closed
    checkClosed: function(today) {
                
          var getHours = this.get("hours")[today];
                    
          // If today has any opening / closing hours associated with it
            if (getHours.close != undefined) {                           

              // Get the closing time for today
                var closingTime = getHours.close; 
                var openTime = getHours.open; 
                var todaysClosingTime = toDate(closingTime,"h:m");

              // Get current time   
                var currentTime = this.times().timeRigtNow;
                var curTime = toDate(currentTime,"h:m")

              // Return whether the place is open or not    
                if (curTime > todaysClosingTime) {
                  return false                  
                } else {
                  return true;
                  
                };                
          // Else if no hours were defined but closed was      
            } else if (getHours.closed != undefined) {                              
                return false;
            } else {
                return true;                
            }
    },

    createMarker:function(){
    
     // new date object  
        //var currentTime = new Date();    
        //var today = currentTime.getDay();
        //console.log(today-1)
        //console.log(this.getDay())
        //console.log(this.times())
      //var today = ;
      var isOpenNow = this.checkClosed( this.times().day ); 
      
      // If the place is open right now then display the full logo
        if (isOpenNow) {
          //console.log('open')
          //console.log(this.get("type").toLowerCase())
          switch(this.get("type").toLowerCase()){
            case 'postshop':
            var pinImage = new google.maps.MarkerImage("./img/sprite.locator.png",
                  new google.maps.Size(24, 36),
                  new google.maps.Point(0,25),
                  new google.maps.Point(10, 34));
              break;
            case 'postbox':
            var pinImage = new google.maps.MarkerImage("./img/sprite.locator.png",
                  new google.maps.Size(24, 36),
                  new google.maps.Point(80,25),
                  new google.maps.Point(10, 34));
            break;
            case 'postbox lobby':
            var pinImage = new google.maps.MarkerImage("./img/sprite.locator.png",
                  new google.maps.Size(24, 36),
                  new google.maps.Point(40,25),
                  new google.maps.Point(10, 34));
            break;
            case 'atm':
            var pinImage = new google.maps.MarkerImage("./img/sprite.locator.png",
                  new google.maps.Size(24, 36),
                  new google.maps.Point(256,25),
                  new google.maps.Point(10, 34));
            break;
            default:
            var pinImage = new google.maps.MarkerImage("./img/sprite.locator.png",
                  new google.maps.Size(24, 36),
                  new google.maps.Point(0,25),
                  new google.maps.Point(10, 34));
          }

          // var pinShadow = new google.maps.MarkerImage("./img/shadow.png",
          //         new google.maps.Size(40, 37),
          //           new google.maps.Point(0, 0),
          //             new google.maps.Point(12, 35));

        // Otherwise display the greyed out logo 
        } else {

          switch(this.get("type").toLowerCase()){
            case 'postshop':
            var pinImage = new google.maps.MarkerImage("./img/sprite.locator.png",
                  new google.maps.Size(24, 36),
                  new google.maps.Point(0,64),
                  new google.maps.Point(10, 34));
              break;
            case 'postbox':
            var pinImage = new google.maps.MarkerImage("./img/sprite.locator.png",
                  new google.maps.Size(24, 36),
                  new google.maps.Point(80,64),
                  new google.maps.Point(10, 34));
            break;
            case 'postbox lobby':
            var pinImage = new google.maps.MarkerImage("./img/sprite.locator.png",
                  new google.maps.Size(24, 36),
                  new google.maps.Point(40,64),
                  new google.maps.Point(10, 34));
            break;
            case 'atm':
            var pinImage = new google.maps.MarkerImage("./img/sprite.locator.png",
                  new google.maps.Size(24, 36),
                  new google.maps.Point(256,64),
                  new google.maps.Point(10, 34));
            break;
            default:
            var pinImage = new google.maps.MarkerImage("./img/sprite.locator.png",
                  new google.maps.Size(24, 36),
                  new google.maps.Point(0,64),
                  new google.maps.Point(10, 34));
          }

      }
  // Creating a marker and putting it on the map
          var marker = new google.maps.Marker({
            position: this.getLatLng(),
            title: this.get("name"),
            icon: pinImage,
            location_type: this.get("type")
          });
          return marker;       
    },
    
    infowindowContent: function(){
     
     // new date object  
       // var currentTime = new Date();

     // FInd out what day it is
       // var today = currentTime.getDay();
     // Get the corresponding day from the hours array 
        // if(this.get("hours").length > 0) {
        //   var matchingDay = this.get("hours")[today-1];

        //   // If closing times are provided then display a message
        //     if (matchingDay.close != undefined) {
              
        //       // Get the closing time for that day
        //         var closingTime = matchingDay.close; 
        //         var openTime = matchingDay.open; 
        //         var todaysClosingTime = toDate(closingTime,"h:m");
              
        //       // Get current time   
        //         var curHour = currentTime.getHours();
        //         var curMin = currentTime.getMinutes();
        //         var a = curHour+':'+curMin;
        //         var curTime = toDate(a,"h:m")
              
              // If the current time is greater than the closing time the place is closed
              
        //         if (curTime > todaysClosingTime) {
        //           var closedInfo = 'Closed at ' + closingTime + ' today';
        //         } else {                  
        //           if(this.toJSON().type.toLowerCase() === 'atm' ) {
        //            var closedInfo = '';
        //           } else {
        //             var closedInfo = 'Open form '+openTime+' - '+closingTime + ' today'  
        //           }                  
        //         };

        //     } else if (matchingDay.closed != undefined) {
        //           var closedInfo = 'Closed all day';  
        //     } else {
        //           var closedInfo = 'Opening hours unknown';  
        //     };

        // } else {
        //   var closedInfo = '';  
        // }
      // var getHours = this.get("hours")[today].close;
        var isOpenNow = this.checkClosed( this.times().day );   
        var today = this.times().day;
        // If the place is open show the opening times, however for ATM's dont show anything as they are always open
        if(isOpenNow) {
          if (this.toJSON().type.toLowerCase() === 'atm' ) {
            var closedInfo = '';
          } else {
            var closedInfo = 'Open form '+this.get("hours")[today].open+' - '+this.get("hours")[today].close + ' today'   
          }         
        // If its closed descide show whether its been closed all day or closed at a certian time
        } else {
          if (this.get("hours")[today].closed != undefined) {
            var closedInfo = 'Closed all day';  
          } else {
            var closedInfo = 'Closed at ' + this.get("hours")[today].close + ' today';
          }                
        }

      // Work out more info URL
          var id = this.get('id');
          var docUrl = document.URL;
          var startOfString = docUrl.indexOf('locator/');
          var restOfString = docUrl.substring(0, startOfString + 8);
          var url = restOfString+'closest/'+id;
          
      // Set distance       
        var distance = this.get('distance_in_m');
        var distanceKM = parseFloat(distance/1000).toFixed(2);

      // Create info window, this can be a combination of address, distance, opening hours and url        
        var infoWindowHtml = '';
        var header = this.get("type");
        var address = this.get("address");
        infoWindowHtml                                += '<div class="bubble">';
        if ( header.length > 0 )     { infoWindowHtml += '<h2>'+header+'</h2>'};          
        if ( address.length > 0 )    { infoWindowHtml += '<ul><li>'+address+'</li>'};  
        if ( distanceKM.length > 0 ) { infoWindowHtml += '<li>Distance: '+distanceKM+'km</li>'};  
        if ( closedInfo.length > 0 ) { infoWindowHtml += '<li>'+closedInfo+'</li>' };        
        infoWindowHtml                                += '<li><a href="'+url+'">More info...</a></li></ul></div>';
        var bubbleHtml = infoWindowHtml;        
        

        return bubbleHtml;
      
    }


  });

