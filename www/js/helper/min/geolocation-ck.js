/* ---------------------------------------------------------------------------------------------------------
 Geo Location

 * Check if device supports geoLocation, if so callback 
 
---------------------------------------------------------------------------------------------------------*/function getLocation(e){navigator.geolocation?navigator.geolocation.getCurrentPosition(e,error,{maximumAge:75e3}):error("not supported")}function error(e){e.code==1?alert("Location services are not available on your device."):e.code==2?alert("Position unavailable."):e.code==3?alert("Timeout expired."):alert("ERROR:"+e.message)};