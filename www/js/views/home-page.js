/* ---------------------------------------------------------------------------------------------------------
 
 	Home page content	
	
---------------------------------------------------------------------------------------------------------*/


	nzp.HomePageView = Backbone.View.extend({        	
		
		tagName: 'ul',
		className: 'page home-items list list-arrows',
		id: 'home-page',

		initialize: function() {
			_.bindAll(this, "render");        			
		},

		render: function(){ 			
			_.each(this.model.attributes, function (item) {                		                
			    var itemView = new nzp.NavItem({model: item});				    
	        	this.$el.append(itemView.render().el);
            	return this;
            }, this);		
			
			return this;			            
		},

		onClose: function(){
    		this.model.unbind("change", this.render);
  		}

	});