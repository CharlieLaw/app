nzp.Places = Backbone.Collection.extend({
  
  model: nzp.Place,
  apiKey:'a7f0c7b0b123012f06d2000c29b44ac0',
  noResults: 50,
  oDay: '',

  url:function(){    
//    return 'http://api.nzpost.co.nz/locator/api/locations?api_key='+this.apiKey+'&type=ATM&type=Business+Banking+Centre&type=Postbox+Lobby&type=Dropbox&type=Postbox&type=PostShop&nearby_latitude='+this.lat+'&nearby_longitude='+this.lng+'&opening_day='+this.oday+'&max='+this.noResults+'&format=jsonp&callback=?'
      return 'http://api.nzpost.co.nz/locator/api/locations?api_key='+this.apiKey+'&type=Postbox+Lobby&type=Dropbox&type=Postbox&type=PostShop&type=ATM&type=Business+Banking+Centre&nearby_latitude='+this.lat+'&nearby_longitude='+this.lng+'&max='+this.noResults+'&format=jsonp&callback=?'

  },
  
  comparator:function(location){
    return location.get("distance_in_m") || 0;
  },

  bbc:function(){
    return this.filter(function(location){
      return location.get("type").toLowerCase() == "business banking centre";
    });
  },

  atm:function(){
    return this.filter(function(location){
      return location.get("type").toLowerCase() == "atm";
    });
  },

  postShops:function(){
    return this.filter(function(location){
      return location.get("type").toLowerCase() == "postshop";
    });
  },

  postbox:function(){
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
      _(this.postbox()).first(),
      _(this.postShops()).first(),
      _(this.atm()).first(),
      _(this.bbc()).first(),
    ];

    console.log(places)
    return _(places).compact(); //remove any undefined values
  }
});
