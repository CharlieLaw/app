/* ---------------------------------------------------------------------------------------------------------
 
 	Single Navigation Item

 	* Used for the flyout menu items and the home page list

 
---------------------------------------------------------------------------------------------------------*/nzp.MenuView=Backbone.View.extend({initialize:function(){_.bindAll(this,"render")},render:function(){_.each(this.model.attributes,function(e){var t=new nzp.NavItem({model:e});this.$el.append(t.render().el)},this);return this}});nzp.NavItem=Backbone.View.extend({tagName:"li",template:$("#navTemplate").html(),render:function(){var e=_.template(this.template);this.$el.html(e(this.model));this.delegateEvents();return this},events:{"click a":"clicked"},clicked:function(e){e.preventDefault();nzp.$loading.addClass("show");switch(this.model.slug){case"locator":nzp.router.navigate("locator",!0);break;case"ratefinder":nzp.router.navigate("ratefinder",!0);break;case"tracking":nzp.router.navigate("tracking",!0);break;case"contact":nzp.router.navigate("contact",!0);break;default:nzp.router.navigate("",!0)}nzp.$body.removeClass("active");nzp.$loading.removeClass("show")}});