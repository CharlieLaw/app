/* ---------------------------------------------------------------------------------------------------------
 
 	Application Header

 	* HeaderView 		- Wrapper for all header elements
 	* HeaderTitleView2 	- Header title text

 
---------------------------------------------------------------------------------------------------------*/



/********************************************************************************************************
	HeaderView
********************************************************************************************************/


	nzp.HeaderView = Backbone.View.extend({
				    			    					
		initialize: function() {								
			_.bindAll(this, 'render');		
		},

		render: function() {
			
			/* Create instances of the Title and buttons */				
				nzp.headerTitle = new nzp.HeaderTitle(); 
				var headerTitleView = new nzp.HeaderTitleView({
					model: nzp.headerTitle
				});

				var buttons = new nzp.Button(buttonsData); 				
				var buttonsView = new nzp.ButtonsView({
					model: buttons
				});

			/* Append to the element */		    		
	    		this.$el.append(headerTitleView.render().el);    	
				this.$el.append(buttonsView.render().el);				

	        return this;					
		}	

	});		


/********************************************************************************************************
	HeaderTitle
********************************************************************************************************/


	nzp.HeaderTitleView = Backbone.View.extend({
				    			    
		tagName: 'h1',				
		
		initialize: function() {							
			_.bindAll(this, 'render', 'updateTitle');
			this.model.bind('change:title', this.updateTitle);	
		},

		render: function() {			        		        			        	
	    	this.$el.html(this.model.toJSON().title);	
	        return this;					
		},	

		updateTitle: function() {			        		        	
	    	this.$el.text(this.model.toJSON().title);	
	        return this;					
		}	

	});	

