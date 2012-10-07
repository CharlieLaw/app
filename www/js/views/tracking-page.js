/* ---------------------------------------------------------------------------------------------------------
 
 	Tracking List

	Sample Tracking Codes
	
	UD190381395NZ
	EE748286200CN
	EP311788967NZ
	CQ023933725US
	EP501829835NZ
 	
---------------------------------------------------------------------------------------------------------*/


/****************************************************************************************************************
	Individual tracking LIST item
****************************************************************************************************************/


	nzp.TrackingItemView = Backbone.View.extend({

		    el:'<li>',

			template: _.template($('#tmp-tracking-item').html()),

			initialize: function() {
	      		this.model.bind('change', this.render, this);
	      		addFastButtons(this);
	    	},

			events: {
			  //'click a' : 'showDetails'
			  "fastclick": "showDetails"
			},

			render: function() {
				// Wrap the element in an anchor and give the list item an ID
		        	var item = this.template(this.model.toJSON());
		        	this.$el.html(item);
		        	// Highlight item if its a matching code
              		$("a", this.$el).addClass(this.model.get("highlight"));

              		

					return this;
			},

			showDetails: function(e) {
			 	e.preventDefault();
				var pageCode = this.model.toJSON().track_code;
		    	nzp.router.navigate('tracking/'+pageCode, {trigger:true});
			},

// Add fast button

 addFastButtons: function(e) {
	//e.preventDefault();
	var EVENT_NAME = 'fastclick';
    //console.log(e)
    var events = (_.isFunction(this.events) ? this.events() : this.events) || {};
   // console.log(events)
    var that = this;
   // console.log(that)

    function byEventName(key) {
        //console.log(key.substr(0, EVENT_NAME.length + 1) === EVENT_NAME + ' ' || key === EVENT_NAME)
        return key.substr(0, EVENT_NAME.length + 1) === EVENT_NAME + ' ' || key === EVENT_NAME;
    }

    function toJustSelectors(key) {
       // console.log(key.substr(EVENT_NAME.length + 1))
        return key.substr(EVENT_NAME.length + 1);
    }

    function toMatchingElements(selector) {
        //console.log(selector === "" ? [that.el] : that.$(selector).toArray())
        return selector === "" ? [that.el] : that.$(selector).toArray();
    }

    function registerTrigger(element) {
        new MBP.fastButton(element, function() {
           // console.log('d')
            $(element).trigger(EVENT_NAME);
        });
    }

    _.chain(events).keys().filter(byEventName).map(toJustSelectors).map(toMatchingElements).flatten().each(registerTrigger);

}			

	});
MBP.hadTouchEvent = true;


/****************************************************************************************************************
	<ul> Wrapper for tracking list itmes
****************************************************************************************************************/


	var TrackingPageView = Backbone.View.extend({


			template: _.template($('#tmp-tracking').html()),

			el: '<ul id="tracking-list" class="list-tracking list list-arrows">',

			initialize: function() {

			    nzp.trackingPageCollection.bind('add', this.addOne, this);
			    nzp.trackingPageCollection.bind('reset', this.render, this);	// Fires when whole collection updates
			},

			render: function(trackItem) {
				this.addAll();
				$trackingItem = this.$('#tracking-items');
				$('#tracking-page').append(this.$el);
				return this;
			},

			// Rendered at the start to show all items in Local storage			
			addOne: function(trackItem) {
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



/****************************************************************************************************************
	Tracking Form
****************************************************************************************************************/
	

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
				var stringHasSpace = hasWhiteSpace($trackingNo.val());							
				
				if($trackingNo.val() == "") {				
					alert('Please enter a tracking code');
				} else if(stringHasSpace == true) {
					alert('The tracking code cannot contain spaces')
				} else if($trackingNo.val().length <= 9) {
					alert('The code entered is too short')
				} else {
					var tCode = $trackingNo.val();
					this.processTrackingCode(tCode);
				}
				//if($trackingNo.val() != "" && stringHasSpace != true) {				
				//};
			} else {
				nzp.$offline.show();
			}
		},

		// Scan item using PhoneGap barcode plugin
			scanItem: function(e) {
				e.preventDefault();
				//nzp.$loading.show();
				var isOnline = checkStatus();
				if (isOnline) {
		
					// If the user has entered a value into the input box

							nzp.$loading.show();		
						
							var self = this;
							window.plugins.barcodeScanner.scan(							
								function(result) {
									if (!result.cancelled) {
										nzp.$loading.hide();
										self.processTrackingCode(result.text)
									} else {
										nzp.$loading.hide();
									}
								},
								function(error) {			
									nzp.$loading.hide();		
									alert("Scanning failed: " + error)
								}
							);							
						 

						// var self = this;
						// window.plugins.barcodeScanner.scan(							
						// 	function(result) {
						// 		if (!result.cancelled) {
						// 			self.processTrackingCode(result.text)
						// 		}
						// 	},
						// 	function(error) {					
						// 		alert("Scanning failed: " + error)
						// 	}
						// );

					//};

				} else {
					nzp.$offline.show();
				};

				//nzp.$loading.hide();		
			},

			
/****************************************************************************************************************
	Refresh Existing items
		* Loop over tracking page collection
		* Fire each item to the getDeliveryStatus function which will return the deliery status
		* If the status is not sucess then proceed to create a string of tracking codes to process								
		* Keep a record of the number of items 
****************************************************************************************************************/

			refreshItems: function(e) {

				e.preventDefault();
				
				var isOnline = checkStatus();
				if (isOnline) {
								
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
console.log(model)
console.log(key)
console.log(value)
											var currentShortDesc = value.short_description; 	// Returned short description										
											
											// Loop over the collection to find the matching model based on the unique tracking code	
											nzp.trackingPageCollection.each(function(model, i){
																								
												if( model.get('track_code').toUpperCase() == key.toUpperCase() ) {													
													// If the code matches one in the collection, compare the short description
													// If the short desc has changed then save the details, otherwise no change, just remove the spinner														
													saveDetails(model, value, key);
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

/****************************************************************************************************************
	Check for duplicate code and retrieve new item if its not a duplicate	

	*	Loop over the collection to check the code entered is not a dupliate
	*	If it is a duplicate add a classname to hightlight class name
	*	If is not a duplicate then do the AJAX call
****************************************************************************************************************/
		

			processTrackingCode: function(tCode) {				
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
									
									saveDetails(item, data[userCode], userCode, true);

									nzp.$body.removeClass('norefresh'); // Theres something added so show the refresh button
								};								
							}
						});
				};

			}			

	});

//saveDetails(model, value, key);
//saveDetails(item, data[userCode], userCode, true);
var saveDetails = function(currentModel, newModel, trackcode, norefresh) {
	var deliveryStatus = getDeliveryStatus(newModel);	// Get the correct status

	// Save items	
		currentModel.save({											
			error_code:         newModel.error_code, 
			error_desc:         deliveryStatus, 														
			spinner:            ''		
		});
	
	// If the error code is N then pass a custom message as the one returned from the API is not suitable
		if (newModel.error_code != undefined && newModel.error_code == "N") {	
			currentModel.save({
				short_description: errorShortDecTxt(trackcode),
				detail_description:  errorDescTxt(trackcode)
			});
		} else {			
			currentModel.save({
				events:             newModel.events,
				short_description:  newModel.short_description,						
				detail_description: newModel.detail_description 
			});
		};

	// If not a refresh set the timestamp
		if (norefresh) {
			currentModel.save({
				timestamp: 		Date.now()              		
			});			
		};
}

/****************************************************************************************************************
	Get delivery status.  This will be the error, transit or succes code
****************************************************************************************************************/


	var getDeliveryStatus = function(item) {
	
		var trackingStatus;
		// If sucessful there should be events, otherwise there will be an error_code
			if (item.error_code != 'undefined') {			
				// Sucessful call, now find the status of the item
					if (item.error_code == "N" || item.error_code == "U") {						
						trackingStatus = 'error';						
					} else {
						if (item.events != undefined && item.events.length > 0 ) {				
							
						// Sort array based on date, then time						
						// Convert date and time to date object
						// This used date.js as the date returned is not a valid format and need to be US 

							item.events.sort(function(a, b) {
								var dateA = Date.parse(a.date+', '+a.time); // merge the date & time
								var dateB = Date.parse(b.date+', '+b.time); // depending on the format
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


/****************************************************************************************************************
	Improve Error text as its poorly formed HTML thats returned from the API
****************************************************************************************************************/


	var errorShortDecTxt = function(code) {
		return "Error - We don't appear to have a record of that item";
	};

	var errorDescTxt = function(code) {
		var allText = '';
		allText += "<p>The item details may not have been received into our tracking system yet.</p>"; 
		allText += "<p>Please try again later or call <a href='tel: 0800 501 501'>0800 501 501</a> should you require further assistance.</p>";
		allText += "<p>Please ensure your tracking numbers are:</p>";
		allText += "<ul class='mbm'>";
		allText += "<li>Accurately typed</li>";
		allText += "<li>In the format XX123456789XX</li>";
		allText += "</ul>";
		allText += "<p>If you have any questions please check out our <a href='http://www.nzpost.co.nz/faq' id='faq'>frequently asked questions</a>.</p>";

		return allText;
	};


// <P>Sorry, but your tracking number is not valid. Please ensure your tracking numbers are:</P>
// <UL><LI>Accurately typed</LI>
// <LI>In the format XX123456789XX</LI></UL><P>If you have any questions please check out our <A href=\"http://www.nzpost.co.nz/faq\">frequently asked questions.</A></P>	
