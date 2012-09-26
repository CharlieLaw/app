// Locator List Wrapper
nzp.LocatorPageView=Backbone.View.extend({el:'<div id="locator-page" class="page">',initialize:function(){this.template=_.template($("#tmp-locator").html());this.collection.bind("reset",this.render,this)},events:{click:"delegatedEvents"},delegatedEvents:function(e){e.preventDefault();var t=$(e.target);t.hasClass("refresh")&&this.pageRefresh();(t.hasClass("all-map")||t.parent().hasClass("all-map"))&&this.loadAllMap()},render:function(){$(this.el).html(this.template({}));$locationsList=$("#locator-list",this.el);_(this.collection.closestPlaces()).forEach(function(e){$locationsList.prepend((new nzp.LocatorItemView({model:e})).render().el)});return this},loadAllMap:function(e){nzp.router.navigate("locator/nearby/All",{trigger:!0})},pageRefresh:function(){nzp.router.locatorRefresh()}});nzp.LocatorItemView=Backbone.View.extend({tagName:"li",template:_.template($("#singleLocatorTemplate").html()),render:function(){$(this.el).html(this.template(this.model.attributes));return this},events:{"click a":"loadDetails"},loadDetails:function(e){e.preventDefault();nzp.router.navigate("locator/closest/"+this.model.id,{trigger:!0})}});