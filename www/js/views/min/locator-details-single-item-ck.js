/* Locator Detals - This model is used when the user enters the URL directly otherwise a collection will already exist */nzp.LocatorDetailsSinglePage=Backbone.Model.extend({defaults:{apiKey:"a7f0c7b0b123012f06d2000c29b44ac0"},url:function(){return"http://api.nzpost.co.nz/locator/api/details/api_key="+this.get("apiKey")+"&id="+this.get("id")},parse:function(e){}});