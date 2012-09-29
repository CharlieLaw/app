// Array of markers, requied to clear
var markers = [];


var mapAll = Backbone.View.extend({


		initialize: function() {
			_.bindAll(this, 'render', 'allmarkers'); // get access to this in other methods
			//	Set map dimensions
				// mapHeight();

		},

		render: function() {
			// Load map scripts and initialise
				if(typeof google === "undefined"){
	    			nzp.loadGoogleMap();
				} else {
					nzp.initializeMap();
				};
				
				myLocations = {
					lat: this.collection.lat,
					lng: this.collection.lng
				};

				nzp.testMapLoaded(this.allmarkers, {lat:myLocations.lat, lng:myLocations.lng});
		},

		allmarkers: function() {
			
			nzp.infoWindow = new google.maps.InfoWindow();
			var bounds = new google.maps.LatLngBounds();

			// Loop over the Places array and append items to the <ul> contianer

			this.collection.map(function(place){

				var placeData = place.toJSON();
				var latLng = place.getLatLng();
				var marker = place.createMarker();
        		marker.setMap(map);
				// Extend the Latlng bound method
					bounds.extend(latLng);

				// Attaching a click event to the current marker
					(function(marker, place) {
					  google.maps.event.addListener(marker, "click", function(e) {
					    nzp.infoWindow.setContent(place.infowindowContent());
					    nzp.infoWindow.open(map, marker);
					  });
					  markers.push(marker); // Push markers into an array so they can be removed
					})(marker, place);


				//$locationsList.prepend(new LocatorItemView({
				//	model:place
				//}).render().el)
	        }, this);
			map.fitBounds(bounds); // Center based on values added to bounds
      var default_type = nzp.nearby_type || "All";
      nzp.calcMarkers(default_type);
	        return this;
		}

});

// Work out showing and hiding of the markers
	nzp.calcMarkers = function(selectedTab) {
	
		// Loop over markers, find those that match the title of the clicked tab and show them otherwise hide the marker	
			$.each(markers, function(index, item){
				//console.log(item.location_type)
				//if(item.get('location_type').toLowerCase() == 'postbox') {
				//	console.log('yes')
			//	}
//				console.log('to lowercase ' + selectedTab.toLowerCase())
//				console.log('item ' + item.get('location_type').toLowerCase())
				if (selectedTab.toLowerCase() == item.get('location_type').toLowerCase() || selectedTab === 'All') {
					console.log('found match')
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
