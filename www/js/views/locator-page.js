
// Locator List Wrapper
	nzp.LocatorPageView = Backbone.View.extend({

		el: '<div id="locator-page" class="page">',

	    initialize:function () {
	      this.template = _.template($('#tmp-locator').html());
	      this.collection.bind("reset", this.render, this);
		  //addFastButtons(this);
	    },

	    events: {
	    	"click": "delegatedEvents"
		},

		// Delegate events so refresh button works
		delegatedEvents: function(e) {
			e.preventDefault();		
			var $target = $(e.target);

			// Refresh buttons
				if ($target.hasClass('refresh')) {
					this.pageRefresh();
				};
			// Click on the all map list itme or elements within it
				if ($target.hasClass('all-map') || $target.closest('a').hasClass('all-map')) {	
					this.loadAllMap();	
				}		
		},

	    render:function () {
	       	$(this.el).html(this.template({}));

			  $locationsList = $('#locator-list', this.el);
		      _(this.collection.closestPlaces()).forEach(function(place){
		        $locationsList.prepend(new nzp.LocatorItemView({
		            model:place
		        }).render().el);
		      });	     
		     return this;
	    },

		loadAllMap: function(e) {
	    	nzp.router.navigate('locator/nearby/All', {trigger:true});
		},

		pageRefresh: function() {
			nzp.router.locatorRefresh();
		}

	});

// Locator single item
	nzp.LocatorItemView = Backbone.View.extend({

	    tagName:"li",

	    template:_.template($('#singleLocatorTemplate').html()),

	    initialize: function() {
			addFastButtons(this);
	    },

	    render:function () {
	        $(this.el).html(this.template(this.model.attributes));
	        return this;
	    },

		events: {
	    	//"fastclick": "loadDetails"
	    	"fastclick": "loadDetails"
		},

		loadDetails: function(e) {
			nzp.router.navigate('locator/closest/'+this.model.id, {trigger:true});
		}

	});



