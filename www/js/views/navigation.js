/* ---------------------------------------------------------------------------------------------------------
 
 	Single Navigation Item

 	* Used for the flyout menu items and the home page list

 
---------------------------------------------------------------------------------------------------------*/

	nzp.MenuView = Backbone.View.extend({
     	
		initialize: function(){
			_.bindAll(this, "render");        			        			
		},

		render: function(){			
			_.each(this.model.attributes, function (item) {                
			    var itemView = new nzp.NavItem({model: item});				    
	        	this.$el.append(itemView.render().el);            	
            }, this);
			return this; 					

		}

    });
	

	nzp.NavItem = Backbone.View.extend({        	

    	tagName: "li",
    	
    	template: $("#tmp-nav").html(),

		initialize: function() {
			// FT fastclick is not used here, using MBP due to double tap
			addFastButtons(this);
		},

	    render: function(){			       	        
	        var tmpl = _.template(this.template);
	        this.$el.html(tmpl(this.model));			        
	        this.delegateEvents();
            return this;
	    },

	    events: {
	        //"click a": "clicked"
	        'fastclick': 'clicked'
	    },
	    
	    clicked: function(e){
	        e.preventDefault();
	        // Show spinner
				nzp.$loading.addClass('show');
				
			// Change the data attribute so show and hide stuff
				switch(this.model.slug) {		
					case 'locator':						  
					  var isOnline = checkStatus();
					  if (isOnline) {
					  	nzp.router.navigate('locator', true);		
					  } else {
					  	nzp.$offline.show();	
					  };					  
					  break;
					case 'ratefinder':
					  nzp.router.navigate('ratefinder', true);
					  break;
					case 'tracking':						  						  
					  nzp.router.navigate('tracking', true);
					  break;
					case 'contact':											  
					  nzp.router.navigate('contact', true);
					  break;
					default:
						nzp.router.navigate('', true);
				};
			  
				nzp.$page.removeClass("map");
				nzp.$body.removeClass("showform");
				$('.tabbar').remove(); // if the tabbar is present remove it			
				nzp.$body.removeClass('active');
				nzp.$loading.removeClass('show');														

	    }
	    /*
	     addFastButtons: function() {	     	
            var EVENT_NAME = 'fastclick';
            var events = (_.isFunction(this.events) ? this.events() : this.events) || {};
            var that = this;
            console.log(events)
            function byEventName(key) {
                return key.substr(0, EVENT_NAME.length + 1) === EVENT_NAME + ' ' || key === EVENT_NAME;
            }

            function toJustSelectors(key) {
                return key.substr(EVENT_NAME.length + 1);
            }

            function toMatchingElements(selector) {
                return selector === "" ? [that.el] : that.$(selector).toArray();
            }

            function registerTrigger(element) {
                new MBP.fastButton(element, function() {
                    $(element).trigger(EVENT_NAME);
                });
            }

            _.chain(events).keys().filter(byEventName).map(toJustSelectors).map(toMatchingElements).flatten().each(registerTrigger);

        }*/

	    
	});

//MBP.hadTouchEvent = true; // work around some Android 2.3.x workarounds for the demo...

