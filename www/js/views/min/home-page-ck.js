/* ---------------------------------------------------------------------------------------------------------
 
 	Home page content	
	
---------------------------------------------------------------------------------------------------------*//*
	nzp.HomePageView = Backbone.View.extend({        	
		
		el: '<div id="home-page" class="page">',

		//tagName: 'ul'


		initialize: function() {
			_.bindAll(this, "render");        			
		},

		render: function(){
 			var ul = $('<ul class="home-items list list-arrows">');
			_.each(this.model.attributes, function (item) {                		                
			    var itemView = new nzp.NavItem({model: item});				    
	        	$(ul).append(itemView.render().el);
            	return this;
            }, this);					
            $(this.el).append(ul);			 		
		},

		onClose: function(){
    		this.model.unbind("change", this.render);
  		}		

	});
*/nzp.HomePageView=Backbone.View.extend({tagName:"ul",className:"page home-items list list-arrows",id:"home-page",initialize:function(){_.bindAll(this,"render")},render:function(){_.each(this.model.attributes,function(e){var t=new nzp.NavItem({model:e});this.$el.append(t.render().el);return this},this);return this},onClose:function(){this.model.unbind("change",this.render)}});