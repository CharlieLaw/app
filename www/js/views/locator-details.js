
// Locator List Wrapper
nzp.LocatorDetailView = Backbone.View.extend({

	el: '<div id="locator-details-page" class="page">',

    initialize:function () {
      _.bindAll(this, "render");      
      this.template = _.template($('#tmp-locator-detail').html());
      this.collection.bind("reset", this.render, this);
    },

    events: {
    	"click .locator-map": "loadDetails"
	},

    render:function () {
       	this.$el.append(this.template(this.collection.toJSON()));		
	    return this;
    },

	loadDetails: function(e) {
		e.preventDefault();
		var default_mode = nzp.travel_mode || "driving";
		nzp.router.navigate('locator/closest/'+this.collection.id+'/'+default_mode, {trigger:true});
	}


});