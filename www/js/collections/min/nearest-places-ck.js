/* Nearest Places Collection */// nzp.NearestPlacesCollection = Backbone.Collection.extend({						
// 	model: nzp.NearestPlaces,
// 	url: 'http://api.nzpost.co.nz/locator/api/locations?api_key=a7f0c7b0b123012f06d2000c29b44ac0&type=Postbox+Lobby&type=Dropbox&type=Postbox&type=PostShop&nearby_latitude=-41.3000&nearby_longitude=174.7833&lat1=&lng1=&lat2=&lng2=&keyword=&max=30&format=jsonp&callback=?'
// });	
/* Fetch data on page load *///window.Locations = new NearestPlacesCollection();
;