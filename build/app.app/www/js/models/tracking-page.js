
/* Tracking Page Items */
	nzp.TrackingPage = Backbone.Model.extend({
		defaults: {
			apiKey: 'b74c4cd0-b123-012f-7fbc-000c294e04ef',				// API Key
			mockValue: 1,												// Mock Value 1 or 0 - used for testing
			highlight: '',												// ClassName is added to highlight the row
	    	user_added_name: '', 											// User added name
        	short_description: 'loading...',
        	spinner: 'list-spinner'	    	
	    },

    url:function(){
      return 'http://api.nzpost.co.nz/tracking/track?license_key='+this.get('apiKey')+'&tracking_code='+this.get("track_code")+'&mock='+this.get('mockValue')+'&format=jsonp&callback=?';
    },
    parse: function(response){
      if (this.isNew()){
        return response;
      } else {
        return response[this.get("track_code")];
      }

    },
		clear: function() {
	      this.destroy();
	    }
	});

/* Tracking Page Form */
	nzp.TrackingForm = nzp.TrackingPage.extend({
	});


/* Tracking Page Desciption */
	nzp.TrackingDescription = nzp.TrackingPage.extend({
	});
