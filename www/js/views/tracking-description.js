/* ---------------------------------------------------------------------------------------------------------
 
 	Tracking details page

 	* Made of 3 veiws, the form, name (which can be edited) and the item detils
	
 	* nzp.TrackingDetailsForm = Form input, w

---------------------------------------------------------------------------------------------------------*/


		
/****************************************************************************************************************
	Form for submitting a name
****************************************************************************************************************/


		nzp.TrackingDetailsForm = Backbone.View.extend({

			el: '<form action="" id="tracking-add-name" class="tracking-form">',

	 		template: _.template($('#tmp-tracking-description-form').html()),

			initialize:function() {
				_.bindAll(this, 'render');
			},

			events: {
				"submit": "submitForm"
			},

		    render:function() {
				this.$el.html(this.template({}));						// Empty template, no dynamic data
				nzp.$packageName = this.$('#tracking-updated-name');		// Cache the elements being used 
		       //$packageNameForm = this.$('#tracking-add-name');		
		        return this;
		    },

			submitForm: function(e) {
					e.preventDefault();
					var newName = nzp.$packageName.val();					// Get the text entered by the user
					if (newName == "") {				
					 	this.model.save({user_added_name: ''});
					 	return false;									// No value entered
					 } else {
						this.model.save({user_added_name: newName});	// Save new value to local storage
						nzp.$packageName.blur();						// Hides the keyboard in iOS by removing focus
						nzp.$body.removeClass('showform');				// Hides the form

					}
		 			//return false;
		 	}

		});	    


/****************************************************************************************************************
	Add a package name
****************************************************************************************************************/


		nzp.TrackingDetailsUserName = Backbone.View.extend({

			el: '<h2 id="user-added-name">',

	 		template: _.template($('#tmp-tracking-description-name').html()),

			initialize:function() {
				_.bindAll(this, 'render');
				this.model.bind('change', this.update, this);			// Change event will allow the title to be changed automatically

			},

		    render:function() {
				this.$el.html(this.template(this.model.toJSON()));		
				// If a name is empty then hide the <h2>
					if(this.model.toJSON().user_added_name.length === 0) {					
						this.$el.addClass('hide');		
					}		        
		        return this;
		    },

			update:function() {
				var self = this;
				this.$el.html(this.template(this.model.toJSON()));		
				// When rerendering if the name is empty add a class of hide to hide the <h2>
				if(this.model.toJSON().user_added_name.length > 0) {					
					this.$el.addClass('highlight high-out');			// When the item changes add a highlight class		
					this.$el.removeClass('hide')
				} else {
					this.$el.addClass('hide');			// When the item changes add a highlight class		
				}
					
					setTimeout(function() {
						self.$el.removeClass('highlight high-out');		// Then remove it so the highlight work next time
					}, 1000);
				//} else {
				//	nzp.$body.addClass('hasheader')
				//}
		        return this;
		    }

		});	    


/****************************************************************************************************************
	Tracking details buttons.  Email, Edit, Delete
****************************************************************************************************************/


		nzp.TrackingDetails = Backbone.View.extend({

			el: '<div id="tracking-details-page">',

 			template: _.template($('#tmp-tracking-description-item').html()),

			initialize:function() {
				_.bindAll(this, 'render', 'deleteModel', 'showForm', 'processEmail', 'refresh');				
				this.model.bind('change', this.render, this);			// Change event will allow model to be refreshed instantly			
			},


	 		events: {
	    		"click #tracking-delete"  : "deleteModel",
	    		"click #tracking-edit"    : "showForm",
				"click #tracking-email"   : "processEmail", 
				"click #tracking-refresh" : "refresh", 
				"click #faq" 			  : "faqs"
				//"click a" : "allEvents"
			},

			// allEvents: function(e) {
			// 	e.preventDefault();				
			// 	if (e.target.id != '') {
			// 		switch(e.target.id) {
			// 			case 'tracking-delete':
			// 			  this.deleteModel(e);
			// 			  break;
			// 			case 'tracking-edit':
			// 			  this.showForm(e);
			// 			  break;
			// 			case 'tracking-email':
			// 			  this.processEmail(e);
			// 			  break;   
			// 			case 'faq':
			// 				if(cb != null) {
			// 				    cordova.exec("ChildBrowserCommand.showWebPage", e.target.href );
			// 				} else {
			// 					window.location = e.target.href;
			// 				}
			// 			  break;   
			// 			default:

							
			// 		}					
			// 	}// else {										
			// 	// 	if(cb != null) {
			// 	// 	    cordova.exec("ChildBrowserCommand.showWebPage", e.target.href );
			// 	// 	} else {
			// 	// 		window.location = e.target.href;
			// 	// 	};
			// 	// };
			// },


		    render:function() {				
				this.$el.html(this.template(this.model.toJSON()));
		        return this;
		    },

			// Remove model from collection
	 		faqs:function(e) {
				e.preventDefault();
				if(cb != null) {
				    cordova.exec("ChildBrowserCommand.showWebPage", e.target.href );
				} else {
					window.location = e.target.href;
				};
	 		},		    

 		// Remove model from collection
	 		deleteModel:function(e) {
	 			e.preventDefault();
				var confirmit = confirm("Are you sure you want to delete " + this.model.track_code +"?");
				if (confirmit) {
					// Remove the item from local storage
						this.model.clear();
					// Navigate to the tracking page
						nzp.router.navigate('tracking', {trigger:true});
				}
	 		},

		// Change the value of the nice name value and save it to local storage
			showForm:function(e) {
	 			e.preventDefault();	 			
	 			nzp.$body.toggleClass('showform');
				nzp.$packageName.focus();
	 		},

			processEmail: function(e) {
		 		e.preventDefault();
		 		var emailHtml = new nzp.TrackingEmail({
		 			model: this.model		 		
		 		})
		 		emailHtml.render();		 		
		 	},

			refresh: function(e) {
		 		// Request the model
		 		e.preventDefault();

				var isOnline = checkStatus();
				if (isOnline) {

			 		nzp.$loading.show();
					userip = '10.10.10.4';

			 		var track_code = this.model.toJSON().track_code;		 		
					var currentShortDesc = this.model.toJSON().short_description;
					var refreshUrl = 'http://api.nzpost.co.nz/tracking/track?license_key=b74c4cd0-b123-012f-7fbc-000c294e04ef&user_ip_address='+userip+'&tracking_code='+track_code+'&mock=1&format=jsonp&callback=?';																								
					var self = this;

					// Request an item based on the tracking code which will be passed in the defaults					
						$.ajax({
							dataType: 'jsonp',
							url: refreshUrl,
							success: function(data) {
								var tCode = track_code.toUpperCase();
								var newModel = data[tCode];
								saveDetails(self.model, newModel, track_code);
								self.model.save({
									timestamp: Date.now()              		
								});
								nzp.$loading.hide();																	
							}
						});
				} else {
					offLineSpinner(4000);
				}

		 	}		 				 			 		
	});


/****************************************************************************************************************
	Email handling - using phonegap plugin
****************************************************************************************************************/

	// The individual tracked items finer details
	nzp.TrackingEmail = Backbone.View.extend({			

 			template: _.template($('#tmp-tracking-email').html()),

 			//el: 'div',

 			initialize: function() {
 				_.bindAll(this, 'render')
 			},

 			render: function() {
 				

				if (this.model.toJSON().events != undefined && this.model.toJSON().events.length > 0) {

					// Email title
						var title = 'New Zealand Post tracking details for: ' + this.model.toJSON().track_code;
				
					// Find final event
						var events = this.model.toJSON().events;

					// Create Object to pass to template
		 				var bodyData = {
		 					'track_code'		: this.model.toJSON().track_code,
		 					'full_desc'			: this.model.toJSON().detail_description,
		 					'lastDate' 			: events[events.length-1].date,
		 					'lastDescription'	: events[events.length-1].description,
		 					'lastTime'			: events[events.length-1].time
		 				};

				} else {
	 				
		 			// Create Object to pass to template
		 				var bodyData = {
		 					'track_code'		: this.model.toJSON().track_code,
		 					'full_desc'			: this.model.toJSON().detail_description
			 			};
				}; 

				// Use template for HTML content	
					this.$el.html(this.template(bodyData));
					var bodyHtml = this.$el.html(); // Body text in plain html not Jquery object 				

				// Values to create email
					var args = {
			 			subject: title,
			 			body: bodyHtml,
			 			bIsHTML: true
			 		};		 				 		
			
			 		Cordova.exec(null, null, "EmailComposer", "showEmailComposer", [args]);			
 			}
	})