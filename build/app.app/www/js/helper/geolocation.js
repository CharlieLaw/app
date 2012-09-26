
/* ---------------------------------------------------------------------------------------------------------
 Geo Location

 * Check if device supports geoLocation, if so callback 
 
---------------------------------------------------------------------------------------------------------*/


	function getLocation(callback) {
		if (navigator.geolocation) {
		  navigator.geolocation.getCurrentPosition(callback, error, {maximumAge: 75000});
		} else {
		  error('not supported');
		}			
	}

	function error(err) {
	if(err.code==1)
	{
		alert("Location services are not available on your device.");
	}
	else if(err.code==2)
	{
		alert("Position unavailable.");
	}
	else if(err.code==3)
	{
		alert("Timeout expired.");
	}
	else
	{
		alert("ERROR:"+ err.message);
	}
		}
