/* ---------------------------------------------------------------------------------------------------------

 Load Google Map script

	* Load script
	* Load Map
	* Append to map page

---------------------------------------------------------------------------------------------------------*/// function mapLoaded() {
// 	mapAvailable = true;
// }
// Dynamically load Google Map API as not all user will see the map
nzp.loadGoogleMap=function(){var e="AIzaSyCB8uBQ5JEAT9VpNxLfdzovu7O7EJ-lCsM",t=document.createElement("script");t.type="text/javascript";t.src="http://maps.googleapis.com/maps/api/js?key="+e+"&sensor=false&callback=initializeMap";document.body.appendChild(t)};nzp.initializeMap=function(){$("#pages").addClass("map");var e=-41.28646,t=174.776236,n=new google.maps.LatLng(e,t);map=new google.maps.Map(document.getElementById("pages"),{center:n,zoom:5,mapTypeId:google.maps.MapTypeId.ROADMAP})};nzp.testMapLoaded=function(e,t){typeof map=="undefined"?setTimeout(function(){testMapLoaded(e,t)},300):typeof e=="function"&&e(t)};