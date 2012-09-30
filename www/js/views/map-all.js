// Array of markers, requied to clear
var markers = [];

var mapAll = Backbone.View.extend({

	initialize: function() {
		_.bindAll(this, 'render', 'createMarkers'); // get access to this in other methods
	},

	render: function() {

		// Load map scripts and initialise
			if(typeof google === "undefined"){
    			nzp.loadGoogleMap();
			} else {
				nzp.initializeMap();
			};

		// Current location 				
			myLocations = {
				lat: this.collection.lat,
				lng: this.collection.lng
			};

		// Test the map has fully loaded and then pass create the markers	
			nzp.testMapLoaded(this.createMarkers, {lat:myLocations.lat, lng:myLocations.lng});

	},

	createMarkers: function() {
		
		// Instantiate new info window and map bounds
			nzp.infoWindow = new google.maps.InfoWindow();
			var bounds = new google.maps.LatLngBounds();

		// Loop over the Places array and append items to the <ul> contianer
			this.collection.map(function(place){

				var latLng = place.getLatLng();
				var marker = place.createMarker();
        		marker.setMap(map);
				
				// Add to the bound methods lat and long so all markers are show
					bounds.extend(latLng);

				// Attaching a click event to the current marker, and associating a infowindow
					(function(marker, place) {
					  google.maps.event.addListener(marker, "click", function(e) {

					    nzp.infoWindow.setContent(infowindowContent(place)); // Info window content is processed in a method within the model 
					    nzp.infoWindow.open(map, marker);
					  });


					  markers.push(marker); // Push markers into an array so they can be removed
					})(marker, place);

	        }, this);


		
		// Center based on values added to bounds
			map.fitBounds(bounds); 
			
//
// google.maps.event.addListener(map,"bounds_changed",function() {
//     nzp.$loading.hide();
// });

		// Now that all markers have been added to the array work out which ones should be shown
		// By default all markers are shown		
  			var default_type = nzp.nearby_type || "All";
  			markerVisibility(default_type);
        		return this;
	}

});

// Work out showing and hiding of the markers, sits outside mapAll view as its required to be called from the tabs too
	var markerVisibility = function(selectedTab) {
	
		// Loop over markers, find those that match the title of the clicked tab and show them otherwise hide the marker	
			$.each(markers, function(index, item){

				if (selectedTab.toLowerCase() == item.get('location_type').toLowerCase() || selectedTab === 'All') {
					markers[index].setVisible(true);
				} else {
					markers[index].setVisible(false);
				}
			});
			
		// Header		
			nzp.headerTitle.set({title: selectedTab});

		// Update the page URL
	  		nzp.router.navigate("locator/nearby/"+escape(selectedTab),{replace: true});
	
	};
