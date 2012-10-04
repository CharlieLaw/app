/* ---------------------------------------------------------------------------------------------------------
 
 	Tracking List

	Sample Tracking Codes
	
	UD190381395NZ
	EE748286200CN
	EP311788967NZ
	CQ023933725US
	EP501829835NZ
 	
---------------------------------------------------------------------------------------------------------*/



// Individual tracking item
	nzp.TrackingItemView = Backbone.View.extend({

		    el:'<li>',

			template: _.template($('#tmp-tracking-item').html()),

			events: {
			  'click a' : 'showDetails'
			},

			initialize: function() {
	      		this.model.bind('change', this.render, this);
	      		//this.model.bind('change:short_description', this.removeSpinner);
	    	},

	    	//removeSpinner: function() {
			//	alert('updated')
				//console.log(this.toJSON().spinner)
				//setTimeout(function() {
						//this.toJSON().set({spinner: ''});
				//}, 1000);
			//},

			render: function() {
				// Wrap the element in an anchor and give the list item an ID
		    		//this.$el.attr('id', this.model.toJSON().track_code); // Set an ID on the list item
		        	var item = this.template(this.model.toJSON());
		        	this.$el.html(item);
		        	// Highlight item if its a matching code
              		$("a", this.$el).addClass(this.model.get("highlight"));
              		//this.model.set({timestamp: Date.now()});              		
              		//this.model.set("highlight", null);              		

					return this;
			},

			showDetails: function(e) {
			 	e.preventDefault();
				var pageCode = this.model.toJSON().track_code;
		    	nzp.router.navigate('tracking/'+pageCode, {trigger:true});
			}

	});


// Individual tracking item
	var TrackingPageView = Backbone.View.extend({


			template: _.template($('#tmp-tracking').html()),

			el: '<ul id="tracking-list" class="list list-arrows">',

			initialize: function() {

			    nzp.trackingPageCollection.bind('add', this.addOne, this);
			    nzp.trackingPageCollection.bind('reset', this.render, this);	// Fires when whole collection updates
      			//trackingPageCollection.bind('all', this.render, this); // Commented this out as it causes strange behaviours



			},

			render: function(trackItem) {
				this.addAll();
				$trackingItem = this.$('#tracking-items');
				$('#tracking-page').append(this.$el);
				return this;
			},

			// Rendered at the start to show all items in Local storage
			// 
			addOne: function(trackItem) {
				console.log('add one')

				var view = new nzp.TrackingItemView({model: trackItem});				
				// This is prepended with the default values, 
				// Once a sucessful ajax call has been made some defaults are changed and saved (getPackage ajax call)
				this.$el.prepend(view.render().el);																		
			},

			addAll: function() {			
				$(this.el).html("");
				if (nzp.trackingPageCollection.length == 0) {
					nzp.$body.addClass('norefresh')
				}
				nzp.trackingPageCollection.each(function(model){						
					var view = new nzp.TrackingItemView({
						model: model
					});					
					this.$el.append(view.render().el)							
				}, this);					
			}
	});

//{"apiKey":"b74c4cd0-b123-012f-7fbc-000c294e04ef","mockValue":1,"highlight":null,"user_added_name":"Bob","short_description":"Delivered Signature","loading_class":"","timestamp":1348027807384,"track_code":"UD190381395NZ","id":"564b6f7a-1528-76f4-d1e7-d702dfaf5b31","detail_description":"Your item number UD190381395NZ was delivered at 5:40 a.m. on 22 Sep 2009 and was signed for by \"WCP110 NZPOSTSVSCNTRE\"","events":[{"flag":"A","description":"Acceptance","date":"21/09/2009","time":"08:29 AM"},{"flag":"O","description":"Out for Delivery","date":"22/09/2009","time":"04:59 AM"},{"flag":"F","description":"Delivered","date":"22/09/2009","time":"05:40 AM"}]}

// Individual tracking item
	nzp.TrackingFormView = Backbone.View.extend({

		template: _.template($('#tmp-tracking').html()),

		initialize:function() {
			_.bindAll(this, 'render');
			
		},

		events: {
		  'click #tracking-submit': 'getPackage',
		  'click #tracking-scan': 'scanItem',
		  'click #tracking-refresh': 'refreshItems'
		},


		render:function() {

			this.$el.html(this.template({}));
			$trackingNo = this.$('#tracking-number');
			return this;
		},

		getPackage: function(e) {
			e.preventDefault();			
			var isOnline = checkStatus();
			if (isOnline) {
				// If the user has entered a value into the input box
				if($trackingNo.val() != "") {				
					var tCode = $trackingNo.val();
					this.processTrackingCode(tCode);
				};
			} else {
				nzp.$offline.show();
			}
		},

		// Scan item using PhoneGap barcode plugin
			scanItem: function(e) {
				e.preventDefault();
				var isOnline = checkStatus();
				if (isOnline) {
		
					// If the user has entered a value into the input box
					if($trackingNo.val() != "") {				
					

						var self = this;
						window.plugins.barcodeScanner.scan(							
							function(result) {
								if (!result.cancelled) {
									self.processTrackingCode(result.text)
								}
							},
							function(error) {					
								alert("Scanning failed: " + error)
							}
						);

					};

				} else {
					nzp.$offline.show();
				};		
			},

			refreshItems: function(e) {

				e.preventDefault();
				
				var isOnline = checkStatus();
				if (isOnline) {

					// Loop over tracking page collection
					// Fire each item to the getDeliveryStatus function which will return the deliery status
					// If the status is not sucess then proceed to create a string of tracking codes to process								
					// Keep a record of the number of items 
								
					var refreshedItemsArray = [];
					
					// Loop over collection to build up string of tracking codes to refresh, these are passed in the URL
					// Break at 10 as we can only process 10 codes max
						if (this.collection.models.length > 9) {
							alert('You can only refresh 10 items at once')
						};

						for(var i = 0; i < this.collection.models.length; i++) {
							var model = this.collection.models[i];
							var deliveryStatus = getDeliveryStatus(model.toJSON());	// Get the correct status						
							if (deliveryStatus != "success") {							
								var tCode = model.get('track_code');
								var events = model.get("events");	
								refreshedItemsArray.push('&tracking_code='+tCode);
								model.set('spinner', 'list-spinner');							
							};
							if( i === 10 ) { return false };						
						};

					// Make an AJAX call of updated codes if its more than 0 and less than 10
						if (refreshedItemsArray.length == 0 ) {						
							alert('You have no items to refresh');
						} else {
														
							// If there are more than 10 refreshed items only use the first 10
							// Convert Array to string and remove commas to send as part of URL
																									
								var myOldString = refreshedItemsArray.toString();
								var refreshItems = myOldString.replace(/,/g, '');						
								var multiUrl = 'http://api.nzpost.co.nz/tracking/track?license_key=b74c4cd0-b123-012f-7fbc-000c294e04ef&user_ip_address='+userip+'&'+refreshItems+'&mock=1&format=jsonp&callback=?';								
																	

							// Request an item based on the tracking code which will be passed in the defaults					
								$.ajax({
									dataType: 'jsonp',
									url: multiUrl,
									success: function(data) {
										
										$.each(data, function(key, value) { 

											var currentShortDesc = value.short_description; 	// Returned short description										
											
											// Loop over the collection to find the matching model based on the unique tracking code	
											nzp.trackingPageCollection.each(function(model, i){
												
												if( model.get('track_code').toUpperCase() == key.toUpperCase() ) {
													
													// If the code matches one in the collection, compare the short description
													// If the short desc has changed then save the details, otherwise no change, just remove the spinner														
													var deliveryStatus = getDeliveryStatus(value);	// Get the correct status if its changed
													if(model.get('short_description') == currentShortDesc) {											
														// No change has taken place, just hide the spinner													
															model.save({
																spinner:            ''
															});
													} else {
														// The model has changed												
															model.save({
																error_code:         deliveryStatus, 
																detail_description: value.detail_description, 
																short_description:  value.short_description, 
																events:             value.events,
																spinner:            ''
															}); 
													};
												};
											});
										});										
									}
								});

						};
				} else {
					nzp.$offline.show();
				}		

			},

		// Check for duplicate code and retrieve new item if its not a duplicate	
			processTrackingCode: function(tCode) {				
				/*
					Loop over the collection to check the code entered is not a dupliate
				 	If it is a duplicate add a classname to hightlight class name
				 	If is not a duplicate then do the AJAX call
				*/
				$trackingNo.blur(); // Hides keyboard after form submission
				
				var matchingCode;
				this.collection.each(function(model){
					
					if ( model.get("track_code") === tCode ) {
						matchingCode = model;							
						model.set('highlight', 'highlight high-out');
						setTimeout(function(){
							model.set('highlight', 'high-out')
						},1000);
					}
				});

				if (!IsObject(matchingCode)) {			        
			        // Get defaults			        
				        var item = nzp.trackingPageCollection.create({
				        	track_code: tCode
				        }); 
						
					// Request an item based on the tracking code which will be passed in the defaults					
						$.ajax({
							dataType: 'jsonp',
							url: item.url(),
							success: function(data) {
															
								var userCode = tCode.toUpperCase();
								if(data[userCode] != undefined) {
									
									var deliveryStatus = getDeliveryStatus(data[userCode]);	// Get the correct status
									//console.log(deliveryStatus)
									
									if(item.toJSON().track_code != undefined) {																																						
										item.save({
											error_code:         deliveryStatus, 
											detail_description: data[userCode].detail_description, 
											short_description:  data[userCode].short_description, 
											events:             data[userCode].events,
	 										spinner:            ''
										}); // Save the item to the collection and set its spinner to blank            				    										
									} else {
										console.log('unsucessful code')
										item.save({
											error_code:         deliveryStatus, 
											detail_description: data[userCode].detail_description, 
											short_description:  data[userCode].short_description, 
											spinner:            ''
										}); // Save the item to the collection and set its spinner to blank            				    										
									};

									nzp.$body.removeClass('norefresh'); // Theres something added so show the refresh button
								};

								
							}
						});
				};

			}			

	});

	// Get delivery status.  This will be the error code
	var getDeliveryStatus = function(item) {
	
		// Return the tracking status or, error, success and transit.
		//console.log(item)
		var trackingStatus;

		// If sucessful there should be events, otherwise there will be an error_code
			if (item.error_code != 'undefined') {			
				// Sucessful call, now find the status of the item
					if (item.error_code == "N" || item.error_code == "U") {
						trackingStatus = 'error';
						console.log('error code ' + item.error_code)
					} else {
						//console.log(item)
						if (item.events != undefined && item.events.length > 0 ) {				
							
						// Sort array based on date, then time						
						// Convert date and time to date object
						// This used date.js as the date returned is not a valid format and need to be US 

							item.events.sort(function(a, b) {
								var dateA = Date.parse(a.date+', '+a.time); // merge the date & time
								var dateB = Date.parse(b.date+', '+b.time); // depending on the format
								//console.log(dateA)
								//console.log(dateB)
								if (!a.date && b.date)  {
									return 1;
								} else if (a.date && !b.date) {
									return -1;
								} else if (dateA === dateB) {
									return 0;	
								} else {
									return (dateA > dateB) ? 1 : (dateB > dateA ? -1 : 0);
								}
							});

						// Get last item of sorted array
							var lastEl = item.events[item.events.length-1];
							if (lastEl.flag == "F") {
								trackingStatus = 'success'; // Sucessfully delivery								
							} else {
								trackingStatus = 'transit'; // Not reached addres yet								
							}		
						} else {
							trackingStatus = 'error';
						}								
					};
			} else {
				// Error
					trackingStatus = 'error';
			};

		return trackingStatus;
	};