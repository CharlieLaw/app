/* ---------------------------------------------------------------------------------------------------------

 Plot goolge map directions

---------------------------------------------------------------------------------------------------------*/
markerArray = [];
directionsInfoWindow = {};
startWindowHtml = '';
endWindowHtml = '';


nzp.MapDirections = Backbone.View.extend({

	initialize: function() {
		var directionsDisplay, 
			directionsService;
		_.bindAll(this, 'render', 'directionsMap');
	},

	render: function() {
		
		// Load map scripts and initialise
			if(typeof google === "undefined"){
    			nzp.loadGoogleMap();
			} else {
				nzp.initializeMap();
			};
		
		// Test the map has fully loaded and then pass create the markers	
			nzp.testMapLoaded(this.directionsMap);

	},

	directionsMap: function() {

		// Instantiate a directions service.
			directionsDisplay = new google.maps.DirectionsRenderer({
				suppressMarkers: true
			});
			directionsService = new google.maps.DirectionsService();
	  		directionsDisplay.setMap(map);
		
		// Instantiate a directions service.
			directionsInfoWindow = new google.maps.InfoWindow();
  		  		
  		// Current location 				
	  		myLocation = {
	    		lat: this.coords.latitude,
	    		lng: this.coords.longitude
	  		}
  		
  		// Set default mode of travel to driving
  			var default_mode = nzp.travel_mode || "driving";
  			
  		// Assign the model to the nzp object as we need access to it elsewhere	
			nzp.destination = this.model;
			//console.log(nzp.destination)
			calcRoute(default_mode.toUpperCase(), nzp.destination, myLocation);
			//this.calcRoute(default_mode.toUpperCase());
	}

	});


// Calculate the route via google map directions
	
	var calcRoute = function(tMode, destination) {
			var journeyStart,
			journeyEnd,
			bounds = new google.maps.LatLngBounds();
			
	  	// Set page title
			nzp.headerTitle.set({title: tMode.toLowerCase()});				
			existingTravelMode = tMode;

		// Clear out any existing markerArray from previous calculations.
			for (i = 0; i < markerArray.length; i++) {
    			markerArray[i].setMap(null);
  			}

		// Start and End coordinates of the journey
		  	if(destination !== undefined) {
			  	journeyStart = myLocation.lat+','+myLocation.lng;
			  	journeyEnd = destination.getLatLng().toUrlValue();
		  	}

		// Custom Icons for start and of journey,
		// Switch statement work out whether it should be the closed or active state
			/*
			var today = times().day;
	        var isOpenNow = checkClosed( today, destination );           
			if (isOpenNow) {
				switch( destination.toJSON().type.toLowerCase() ) {
					case 'postshop':
					  var sizeX = 24, sizeY = 36, pointaX = 0, pointaY = 25, pointbX = 10, pointbY = 34;   	
					  break;
					case 'postbox lobby':
					  var sizeX = 24, sizeY = 36, pointaX = 40, pointaY = 25, pointbX = 10, pointbY = 34;
					  break;
					case 'postbox':
					  var sizeX = 24, sizeY = 36, pointaX = 80, pointaY = 25, pointbX = 10, pointbY = 34;
					  break;
					case 'atm':
					  var sizeX = 24, sizeY = 36, pointaX = 256, pointaY = 25, pointbX = 10, pointbY = 34;   	
					  break;
					default:
					  var sizeX = 33, sizeY = 37, pointaX = 0, pointaY = 25, pointbX = 16, pointbY = 18;
				}				
			} else {
				switch( destination.toJSON().type.toLowerCase() ) {
					case 'postshop':
					  var sizeX = 24, sizeY = 36, pointaX = 0, pointaY = 64, pointbX = 10, pointbY = 34;   	
					  break;
					case 'postbox lobby':
					  var sizeX = 24, sizeY = 36, pointaX = 40, pointaY = 64, pointbX = 10, pointbY = 34;
					  break;
					case 'postbox':
					  var sizeX = 24, sizeY = 36, pointaX = 80, pointaY = 64, pointbX = 10, pointbY = 34;
					  break;
					case 'atm':
					  var sizeX = 24, sizeY = 36, pointaX = 256, pointaY = 64, pointbX = 10, pointbY = 34;   	
					  break;
					default:
					  var sizeX = 33, sizeY = 37, pointaX = 0, pointaY = 64, pointbX = 16, pointbY = 18;
				}
			};*/

			var destinationMarker = createMarker(destination);

			var icons = {
			  start: new google.maps.MarkerImage(
			   './img/sprite.png',   
			   new google.maps.Size( 60, 60 ),
			   new google.maps.Point( 0, 102 ),
			   new google.maps.Point( 30, 30 )
			  ),
			  end: destinationMarker
			 //  end: new google.maps.MarkerImage(destinationMarker
			 //   './img/sprite.locator.png',
				// new google.maps.Size( sizeX, sizeY ),
			 //   new google.maps.Point( pointaX, pointaY ),
			 //   new google.maps.Point( pointbX, pointbY )
			 //  )
			};

		// Journey details
			var request = {
				origin: 	 journeyStart,
				destination: journeyEnd,
				travelMode:  google.maps.TravelMode[tMode]				
			};

		// Check if the directions service is available and process the reponse	
			directionsService.route( request, function( response, status ) {
				if ( status == google.maps.DirectionsStatus.OK ) {
					directionsDisplay.setDirections(response); 
					processMarker(response)
				}
			});


function processMarker( directionResults ) {				


	var leg = directionResults.routes[0].legs[0];

// Pass the lat long bounds of the start and end location
	bounds.extend(leg.start_location);
	bounds.extend(leg.end_location);

	// The start and end markers are handled differently as there will only over be 2
	// and its necessary to overwrite the default behavious for the 2 markers

	// Start Location
		var marker = new google.maps.Marker({
			position: leg.start_location,
			map: map,
			icon: icons.start
		});

		startWindowHtml = '';// Empty bubble
		startWindowHtml += '<div class="bubble">';
		startWindowHtml += '<h2>Current location</h2>';          
		startWindowHtml += '<p class="mbn">'+leg.start_address+'</p>';          
		startWindowHtml += '</div>';

		attachInstructionText(marker, startWindowHtml);
		markerArray[0] = marker;

	// End Location	
		var marker2 = new google.maps.Marker({
	        position: leg.end_location,
	        map: map,
	        icon: icons.end
	    });

		// Create info window for destination.  
		//This is build from the same function as the all map markers
		endWindowHtml = ''; // Empty bubble
		var endWindowHtml = infowindowContent(nzp.destination)
		
		attachInstructionText(marker2, endWindowHtml);
		markerArray[1] = marker2;		

}

function attachInstructionText(marker, text) {
	
	google.maps.event.addListener(marker, 'click', function() {
		directionsInfoWindow.setContent(text);
		directionsInfoWindow.open(map, marker);			    
	});
// google.maps.event.addListener(map,"bounds_changed",function() {
// nzp.$loading.hide();
// });
	map.fitBounds(bounds); // Center based on values added to bounds

	nzp.$loading.hide();
};


		// Update the URL
			nzp.router.navigate("locator/closest/"+nzp.current_place.id+"/"+tMode.toLowerCase(), {replace: true})	
	}
