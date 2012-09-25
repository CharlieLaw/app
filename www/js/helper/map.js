/* ---------------------------------------------------------------------------------------------------------

 Load Google Map script

	* Load script
	* Load Map
	* Append to map page

---------------------------------------------------------------------------------------------------------*/


	// function mapLoaded() {
	// 	mapAvailable = true;
	// }

	// Dynamically load Google Map API as not all user will see the map
		nzp.loadGoogleMap = function() {
		  //console.log('load map script into page');
		  var apiKey = 'AIzaSyCB8uBQ5JEAT9VpNxLfdzovu7O7EJ-lCsM';
		  var script = document.createElement("script");
		  script.type = "text/javascript";
		  script.src = "http://maps.googleapis.com/maps/api/js?key="+apiKey+"&sensor=false&callback=initializeMap";
		  document.body.appendChild(script);
		}

	// Initalise Map
		nzp.initializeMap =  function() {
      $("#pages").addClass("map");
		  	//console.log('initialize map');
		  	var lat = -41.286460;
			var lng = 174.776236;
			var myLatlng = new google.maps.LatLng(lat, lng);
			map = new google.maps.Map(document.getElementById("pages"), {
				  center: myLatlng,
				  zoom: 5,
				  mapTypeId: google.maps.MapTypeId.ROADMAP
			});

			//console.log(map)
		}

	// Test if the Google Map object is available, if not try again until it is
		nzp.testMapLoaded = function(callback, mapData) {
			//console.log('test map loaded');
			if(typeof map === "undefined"){
				setTimeout(function(){testMapLoaded(callback, mapData)}, 300);
			} else {
				if(typeof callback == 'function') {					
					callback(mapData)
				}
			}
		}

	// Set Map Height	- This could be imporved to make dynamic but not needed if we know this info upfront.
		//var mapHeight = function() {
			// var header = 45;
			// var tabbar = 50;
			// var docHeight = $(document).height();
			// var availableSpace = docHeight - (header + tabbar);
			// $('#pages').css('minHeight', availableSpace+'px')
		//}
