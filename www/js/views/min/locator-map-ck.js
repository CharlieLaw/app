/* ---------------------------------------------------------------------------------------------------------

 Plot goolge map directions

---------------------------------------------------------------------------------------------------------*/nzp.MapPageView=Backbone.View.extend({initialize:function(){var e,t,n,r;_.bindAll(this,"render","directionsMap")},render:function(){typeof google=="undefined"?nzp.loadGoogleMap():nzp.initializeMap();nzp.testMapLoaded(this.directionsMap,this.model)},directionsMap:function(e){directionsDisplay=new google.maps.DirectionsRenderer;directionsService=new google.maps.DirectionsService;directionsDisplay.setMap(map);myLocation={lat:this.coords.latitude,lng:this.coords.longitude};var t=nzp.travel_mode||"driving";nzp.calcRoute(t.toUpperCase(),e,myLocation)}});nzp.calcRoute=function(e,t,n){nzp.headerTitle.set({title:e.toLowerCase()});existingTravelMode=e;if(t!==undefined){journeyStart=n.lat+","+n.lng;journeyEnd=t.getLatLng().toUrlValue()}var r={origin:journeyStart,destination:journeyEnd,travelMode:google.maps.TravelMode[e]};directionsService.route(r,function(e,t){t==google.maps.DirectionsStatus.OK&&directionsDisplay.setDirections(e)});nzp.router.navigate("locator/closest/"+nzp.current_place.id+"/"+e.toLowerCase(),{replace:!0})};