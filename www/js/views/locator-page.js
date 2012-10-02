
// Locator List Wrapper
	nzp.LocatorPageView = Backbone.View.extend({

		el: '<div id="locator-page" class="page">',

	    initialize:function () {
	      this.template = _.template($('#tmp-locator').html());
	      this.collection.bind("reset", this.render, this);

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
				if ($target.hasClass('all-map') || $target.parent().hasClass('all-map')) {
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

	    render:function () {
	        $(this.el).html(this.template(this.model.attributes));
	        return this;
	    },

		events: {
	    	"click a": "loadDetails"
		},

		loadDetails: function(e) {
			e.preventDefault();
			nzp.router.navigate('locator/closest/'+this.model.id, {trigger:true});
		}

	});



