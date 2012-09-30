	/* Button */

	 // Create the tabs wrapper - The el is passed through when intantiated.
		nzp.TabView = Backbone.View.extend({

			initialize: function(){
				_.bindAll(this, "render");
				this.tabtype = this.options.tabtype;
			},

			render: function(){
				// Loop over each tab and create a single tab
				this.collection.each(function (item) {
					var itemView = new nzp.SingleTabView({model: item, parentview: this.tabtype});
					this.$el.append(itemView.render().el)
	       }, this);
	       return this;
			}
		})

	 // Individual tabs
		 nzp.SingleTabView = Backbone.View.extend({
	    	tagName: "li",
	    	//template: $("#tabTemplate").html(),

		    events: {
		        "click a": "clicked"
		    },

		    initialize: function() {
	        	_.bindAll(this, 'render');
            	this.model.bind("change:highlighted",this.highlight, this);
		        // if(this.model.id === 0) {
		        // 	this.$el.addClass('tab-current');
		        // };
	        	this.render();
	    	},

clicked: function(e){

	var self = this;

	e.preventDefault();

	// If the tab is used for switching travel modes, calculate the route
	if (this.options.parentview == 'travelroute') {
		var tmode = this.model.get("slug").toUpperCase();		

		//var updatedDirections = new nzp.MapDirections;
		//updatedDirections.calcRoute(tmode);
		//console.log(updatedDirections.bigBaws())
		var lat = (nzp.destination.toJSON().lat)
		var lng = (nzp.destination.toJSON().lng)
		//console.log(lat +', '+ lng)

		calcRoute(tmode, nzp.destination);
	


	//if( !this.$el.hasClass("tab-current") ) {
	//	nzp.calcMarkers(this.model.get("title")); // Function sits in the locator-all-map.js
	//}

	//console.log(this.model.get("title"))			        	
	};

	// If the tab is used to switch between postal markers
	if ( this.options.parentview === 'allmarkers' ) {
		// Only update the markders if a differnt tab is clicked
		nzp.infoWindow.close() // Close info window
		
		if( !this.$el.hasClass("tab-current") ) {
			markerVisibility(this.model.get("title")); // Function sits in the locator-all-map.js
		}
	}
	
	this.model.collection.each(function(tab){
		if (tab == self.model){
			tab.set("highlighted", true);
		} else {
			tab.set("highlighted", false);
		}
	});

},

        highlight: function(){
          // Loop over each of the List items to remove the tab-current class and Add the tab-current class to the clicked item
              if (this.model.get("highlighted")){
                this.$el.addClass('tab-current');
              } else{
                this.$el.removeClass('tab-current');
              }
              // this.$el.parent().find('li').each(function(index) {
              //   $(this).removeClass('tab-current');
              // });

        },
		    render: function(){
     			var tmpl = _.template("<a href='#' class='<% print(slug); %>'><span><% print(title); %></span></a>");
				var tmplData = tmpl({slug: 'tab-'+this.model.toJSON().slug, title:this.model.toJSON().title});
		        this.$el.html(tmplData);
	            return this;
		    }
		});


