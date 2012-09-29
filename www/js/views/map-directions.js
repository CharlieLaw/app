/* ---------------------------------------------------------------------------------------------------------

 Plot goolge map directions

---------------------------------------------------------------------------------------------------------*/
markerArray = [];
stepDisplay = {};
startWindowHtml = '';
endWindowHtml = '';


nzp.MapDirections = Backbone.View.extend({

	initialize: function() {
		var directionsDisplay, 
			directionsService, 
			journeyStart, 
			journeyEnd,
			iWindow;
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
		//infoWindow = new google.maps.InfoWindow();
		//routeMarkers = [];

		// Instantiate a directions service.
		directionsDisplay = new google.maps.DirectionsRenderer({
			suppressMarkers: true
		});
		iWindow = new google.maps.InfoWindow();
		directionsService = new google.maps.DirectionsService();
	  	directionsDisplay.setMap(map);
		stepDisplay = new google.maps.InfoWindow();
  		
  		myLocation = {
    		lat: this.coords.latitude,
    		lng: this.coords.longitude
  		}
  		
  		var default_mode = nzp.travel_mode || "driving";
  		nzp.mapItem = this.model.toJSON();
  		
		nzp.calcRoute(default_mode.toUpperCase(), closest, myLocation);

	}

	});

// Calculate the route via google map directions
	
	nzp.calcRoute = function(tMode, closest, myLocations) {
			routeMarkers = [];
			
			var bounds = new google.maps.LatLngBounds();
			
	  	// Set page title
			nzp.headerTitle.set({title: tMode.toLowerCase()});				
			existingTravelMode = tMode;

		// Clear out any existing markerArray from previous calculations.
			for (i = 0; i < markerArray.length; i++) {
    			markerArray[i].setMap(null);
  			}

		// Start and End coordinates of the journey
		  	if(closest !== undefined) {
			  	journeyStart = myLocations.lat+','+myLocations.lng;
			  	journeyEnd = closest.getLatLng().toUrlValue();
		  	}
	  	    	
		// Custom Icons for start and of journey
			switch( nzp.mapItem.type.toLowerCase() ) {
				case 'postshop':
				  var sizeX = 24, sizeY = 36, pointaX = 0, pointaY = 25, pointbX = 10, pointbY = 34;   	
				  break;
				case 'postbox':
				  var sizeX = 24, sizeY = 36, pointaX = 80, pointaY = 25, pointbX = 10, pointbY = 34;
				  break;
				case 'postbox lobby':
				  var sizeX = 24, sizeY = 36, pointaX = 40, pointaY = 25, pointbX = 10, pointbY = 34;
				  break;
				default:
				  var sizeX = 33, sizeY = 37, pointaX = 0, pointaY = 25, pointbX = 16, pointbY = 18;
			}
			var icons = {
			  start: new google.maps.MarkerImage(
			   './img/sprite.locator.png',   
			   new google.maps.Size( 60, 60 ),
			   new google.maps.Point( 0, 102 ),
			   new google.maps.Point( 30, 30 )
			  ),
			  end: new google.maps.MarkerImage(
			   './img/sprite.locator.png',
				new google.maps.Size( sizeX, sizeY ),
			   new google.maps.Point( pointaX, pointaY ),
			   new google.maps.Point( pointbX, pointbY )
			  )
			};

		// Journey details
			var request = {
				origin:journeyStart,
				destination:journeyEnd,
				travelMode: google.maps.TravelMode[tMode]				
			};

		// Check if the directions service is available and process the reponse	
			directionsService.route( request, function( response, status ) {
				if ( status == google.maps.DirectionsStatus.OK ) {
					//console.log(response)
					directionsDisplay.setDirections(response);  			
					processMarker(response)
					
					// var leg = response.routes[0].legs[0];
					// // Create custom markers and info window
					// startMarker(leg.start_location, icons.start, "title", leg);
					// endMarker(leg.end_location, icons.end, 'title', model);
					
				}
	});

function processMarker( directionResults ) {				


	var leg = directionResults.routes[0].legs[0];

// Pass the lat long bounds of the start and end location
	bounds.extend(leg.start_location);
	bounds.extend(leg.end_location);

// Start Location
	var marker = new google.maps.Marker({
		position: leg.start_location,
		map: map,
		icon: icons.start
	});

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

	endWindowHtml += '<div class="bubble">';
	endWindowHtml += '<h2>'+nzp.mapItem.name+'</h2>';          
	endWindowHtml += '<ul><li>'+nzp.mapItem.address+'</li>';  
	endWindowHtml += '<li><a href="url">More info...</a></li></ul></div>';

	attachInstructionText(marker2, endWindowHtml);
	markerArray[1] = marker2;		



       //console.log(markerArray)		      
//				  }

					//startMarker(leg.start_location, icons.start, "title", leg);
					//endMarker(leg.end_location, icons.end, 'title', model);
}

function attachInstructionText(marker, text) {
	google.maps.event.addListener(marker, 'click', function() {
		stepDisplay.setContent(text);
		stepDisplay.open(map, marker);			    
	});
	map.fitBounds(bounds); // Center based on values added to bounds
};

			// Strat marker
			/*
			function startMarker( position, icon, title, leg, model ) {
			

				var marker = new google.maps.Marker({
					position: position,
					map: map,
					icon: icon,
					title: title
				});

				

				google.maps.event.addListener(marker, 'click', function() {
					startWindowHtml = '';
					startWindowHtml += '<div class="bubble">';
					startWindowHtml += '<h2>Current location</h2>';          
					startWindowHtml += '<p class="mbn">'+leg.start_address+'</p>';          
					startWindowHtml += '</div>';

					iWindow.setContent(startWindowHtml);
					iWindow.open(map, marker);
				});	

				

			};

			function endMarker( position, icon, title, model ) {

				
				var marker = new google.maps.Marker({
					position: position,
					map: map,
					icon: icon,
					title: title
				});
				
				routeMarkers.push(marker);
				
				google.maps.event.addListener(marker, 'click', function() {
					endWindowHtml = '';
					endWindowHtml += '<div class="bubble">';
					endWindowHtml += '<h2>'+model.name+'</h2>';          
					endWindowHtml += '<ul><li>'+model.address+'</li>';  
					//infoWindowHtml += '<li>Distance: '+distanceKM+'km</li>'};  
					//infoWindowHtml += '<li>'+closedInfo+'</li>' };        
					endWindowHtml += '<li><a href="url">More info...</a></li></ul></div>';

					iWindow.setContent(endWindowHtml);
					iWindow.open(map, marker);
				});
			*/
				
//console.log(routeMarkers)
			//};

			//console.log(routeMarkers)

		// Update the URL
			nzp.router.navigate("locator/closest/"+nzp.current_place.id+"/"+tMode.toLowerCase(), {replace: true})	
	}
