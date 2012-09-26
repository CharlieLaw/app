/* Tracking Page  */
    nzp.TrackingPageCollection = Backbone.Collection.extend({

        model: nzp.TrackingPage,

        localStorage: new Backbone.LocalStorage("tracking"),

    		comparator: function(a,b) {
      			// return ab.get("user_added_name");
                //console.log(a.get("timestamp"));
                //console.log(b.get("timestamp"));
      			return b.get("timestamp") - a.get("timestamp");		// Sort order by timestamp
    		},

        clear: function() {
            this.destroy();					// Remove item
        }

    });
