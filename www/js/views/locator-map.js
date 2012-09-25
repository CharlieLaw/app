/* ---------------------------------------------------------------------------------------------------------

 Plot goolge map directions

---------------------------------------------------------------------------------------------------------*/



nzp.MapPageView = Backbone.View.extend({

	initialize: function() {
		var directionsDisplay, 
			directionsService, 
			journeyStart, 
			journeyEnd;
		_.bindAll(this, 'render', 'directionsMap');
	},

	render: function() {
		

		// Load map scripts and initialise
			if(typeof google === "undefined"){
    			nzp.loadGoogleMap();
			} else {
				nzp.initializeMap();
			}

		// Plot the map directions, test that it's actually loaded first before passing the geo lat data
			//console.log(this.model)
			nzp.testMapLoaded(this.directionsMap, this.model);

	},

	directionsMap: function(closest) {

		directionsDisplay = new google.maps.DirectionsRenderer();
		directionsService = new google.maps.DirectionsService();
	  	directionsDisplay.setMap(map);
  		
  		myLocation = {
    		lat: this.coords.latitude,
    		lng: this.coords.longitude
  		}
  		
  		var default_mode = nzp.travel_mode || "driving"
  		//console.log(closest)
		nzp.calcRoute(default_mode.toUpperCase(), closest, myLocation);

	}

	});

// Calculate the route via google map directions
	
	nzp.calcRoute = function(tMode, closest, myLocations) {
	  	
		//var infoWindow = new google.maps.InfoWindow();
		// Creating an InfoWindow object
		
//console.log(closest)
		//var infowindow = new google.maps.InfoWindow({
		  //content: 'Hello world'
		//});
		//console.log(infowindow)

	  	// Set page title
			nzp.headerTitle.set({title: tMode.toLowerCase()});				
			existingTravelMode = tMode;

	  	// Start and End coordinates of the journey
		  	if(closest !== undefined) {
			  	journeyStart = myLocations.lat+','+myLocations.lng;
			  	journeyEnd = closest.getLatLng().toUrlValue();
		  	}
    	
    	// Data to pass directions API  			
			var request = {
				origin:journeyStart,
				destination:journeyEnd,
				travelMode: google.maps.TravelMode[tMode]				
			};

			//infoWindow.setContent(place.infowindowContent());
			//infoWindow.open(map, marker);


		// Pass route to Google	
			directionsService.route(request, function(result, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(result);
				}
			});

			//infowindow.open(map, request.destination);

		// Update the URL
			nzp.router.navigate("locator/closest/"+nzp.current_place.id+"/"+tMode.toLowerCase(), {replace: true})	
	}
