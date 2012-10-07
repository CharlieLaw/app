/* ---------------------------------------------------------------------------------------------------------
 
 	Header Buttons

 	* ButtonView 		- Wrapper for all butons elements within the header
 	* SingleButtonView 	- Individual button with different click events for each

 
---------------------------------------------------------------------------------------------------------*/



/********************************************************************************************************
	ButtonView
********************************************************************************************************/

		
		nzp.ButtonsView = Backbone.View.extend({
			
			tagName: 'ul',

			className: 'buttons',

			initialize: function(){
				_.bindAll(this, "render");
			},

			render: function(){
				_.each(this.model.attributes, function (item) {
					var itemView = new nzp.SingleButtonView({model: item});
					this.$el.append(itemView.render().el)
	            }, this);
	            return this;
			}
		});


/********************************************************************************************************
	
	Individual Buttons
	
	* Create each nav button, all will have different click events

********************************************************************************************************/


		nzp.SingleButtonView  = Backbone.View.extend({

	    	tagName: "li",

		    initialize: function() {
	        	_.bindAll(this, 'render');
	        	addFastButtons(this);
	    	},
	    	
		    events: {
		        "fastclick": "clicked"
		        //"click a": "clicked"
		    },

		    clicked: function(e){
		        e.preventDefault();		        
				switch(this.model.slug) {
					case 'home':
					  console.log('home button clicked');
					  break;
					case 'menu':
					  nzp.$body.toggleClass('active');
					  break;
					case 'back':
					  nzp.router.navigate(nzp.router.previousPage, true);
					  clearPossibles();
					  // nzp.$page.removeClass("map");
					  // nzp.$body.removeClass("showform");
       //      		  $('.tabbar').remove(); // if the tabbar is presenet remove it
					  break;					
					default:
					  nzp.router.navigate('', true);
				};
		    },

		    render: function(){
				var tmpl = _.template("<a href='#' class='<% print(classname); %>'><% print(title); %></a>");
				var tmplData = tmpl({classname: this.model.classname, title: this.model.title});
		        this.$el.html(tmplData);
	            return this;
		    }

		});

function clearPossibles() {
	nzp.$page.removeClass("map");
	nzp.$body.removeClass("showform");
	$('.tabbar').remove(); // if the tabbar is presenet remove it
};