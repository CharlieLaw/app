
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

    createMarker:function(){
      switch(this.get("type")){
          case 'PostShop':
          var pinImage = new google.maps.MarkerImage("./img/sprite.locator.png",
                new google.maps.Size(24, 36),
                new google.maps.Point(0,25),
                new google.maps.Point(10, 34));
            break;
          case 'Postbox':
          var pinImage = new google.maps.MarkerImage("./img/sprite.locator.png",
                new google.maps.Size(24, 36),
                new google.maps.Point(80,25),
                new google.maps.Point(10, 34));
          break;
          case 'Postbox Lobby':
          var pinImage = new google.maps.MarkerImage("./img/sprite.locator.png",
                new google.maps.Size(24, 36),
                new google.maps.Point(40,25),
                new google.maps.Point(10, 34));
          break;
          default:
          var pinImage = new google.maps.MarkerImage("./img/sprite.locator.png",
                new google.maps.Size(24, 36),
                new google.maps.Point(0,25),
                new google.maps.Point(10, 34));
        }

        var pinShadow = new google.maps.MarkerImage("./img/shadow.png",
                new google.maps.Size(40, 37),
                  new google.maps.Point(0, 0),
                    new google.maps.Point(12, 35));

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
        var currentTime = new Date();

     // FInd out what day it is
        var today = currentTime.getDay();
     // Get the corresponding day from the hours array 
        if(this.get("hours").length > 0) {
          var matchingDay = this.get("hours")[today-1];

          // If closing times are provided then display a message
            if (matchingDay.close != undefined) {
              
              // Get the closing time for that day
                var closingTime = matchingDay.close; 
                var openTime = matchingDay.open; 
                var todaysClosingTime = toDate(closingTime,"h:m");
              
              // Get current time   
                var curHour = currentTime.getHours();
                var curMin = currentTime.getMinutes();
                var a = curHour+':'+curMin;
                var curTime = toDate(a,"h:m")
              
              // If the current time is greater than the closing time the place is closed
                if (curTime > todaysClosingTime) {
                  var closedInfo = 'Closed at ' + closingTime + ' today';
                } else {
                  var closedInfo = 'Open form '+openTime+' - '+closingTime + ' today'
                };

            } else if (matchingDay.closed != undefined) {
                  var closedInfo = 'Closed all day';  
            } else {
                  var closedInfo = 'Opening hours unknown';  
            };

        } else {
          var closedInfo = '';  
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

