
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
      
      // Find what day it is and whether the place is open or not
        var today = times().day;
        var isOpenNow = checkClosed( today, this ); 
      
      // If the place is open right now then display the full logo
        if (isOpenNow) {
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

    }

  });



