nzp.Places = Backbone.Collection.extend({
  
  model: nzp.Place,
  apiKey:'a7f0c7b0b123012f06d2000c29b44ac0',
  noResults: 15,

  url:function(){    
    return 'http://api.nzpost.co.nz/locator/api/locations?api_key='+this.apiKey+'&type=Postbox+Lobby&type=Dropbox&type=Postbox&type=PostShop&nearby_latitude='+this.lat+'&nearby_longitude='+this.lng+'&lat1=&lng1=&lat2=&lng2=&keyword=&max='+this.noResults+'&format=jsonp&callback=?'
  },
  comparator:function(location){
    return location.get("distance_in_m") || 0;
  },
  postShops:function(){
    return this.filter(function(location){
      return location.get("type").toLowerCase() == "postshop";
    });
  },
  postboxs:function(){
    return this.filter(function(location){
      return location.get("type").toLowerCase() == "postbox";
    });
  },
  postboxLobbies:function(){
    return this.filter(function(location){
      return location.get("type").toLowerCase() == "postbox lobby";
    });
  },
  closestPlaces:function(){
    places = [
      _(this.postboxLobbies()).first(),
      this.postboxs()[0],
      this.postShops()[0]
    ];
    return _(places).compact(); //remove any undefined values
  }
});
