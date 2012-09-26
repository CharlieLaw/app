/* ---------------------------------------------------------------------------------------------------------
 
 	Tracking details page

 	* Made of 3 veiws, the form, name (which can be edited) and the item detils
	
 	* nzp.TrackingDetailsForm = Form input, w

---------------------------------------------------------------------------------------------------------*/

	// Form area
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
					var newName = nzp.$packageName.val();					// Get the text entered by the user
					if (newName == "") {				
					 	//nzp.$body.addClass('noheader')
					 	this.model.save({user_added_name: ''});
					 	return false;									// No value entered
					 } else {
						this.model.save({user_added_name: newName});	// Save new value to local storage
						nzp.$packageName.blur();							// Hides the keyboard in iOS by removing focus
						nzp.$body.removeClass('showform');				// Hides the form

					}
		 			//return false;
		 		},	    
		});	    


	// Edit the package name
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

	// The individual tracked items finer details
		nzp.TrackingDetails = Backbone.View.extend({

			el: '<div id="tracking-details-page">',

 			template: _.template($('#tmp-tracking-description-item').html()),

	 		events: {
	    		"click #tracking-delete": "deleteModel",
	    		"click #tracking-edit"  : "showForm"
			},

			initialize:function() {
				_.bindAll(this, 'render', 'deleteModel', 'showForm');				
			},

		    render:function() {
				this.$el.html(this.template(this.model.toJSON()));
		        return this;
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
	 			//alert(window.scrollTo(0,45))
	 			//$packageName = this.$('#tracking-updated-name');
	 			console.log(nzp.$packageName)
	 			
	 			nzp.$body.toggleClass('showform');
				nzp.$packageName.focus();
	 		}

	});
