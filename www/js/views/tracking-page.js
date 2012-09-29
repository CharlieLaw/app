/* Sample Tracking Codes
	UD190381395NZ
	EE748286200CN
	EP311788967NZ
	CQ023933725US
	EP501829835NZ
*/

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
              		//console.log(this.model)
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
				//console.log('add one')
				var view = new nzp.TrackingItemView({model: trackItem});				
				// This is prepended with the default values, 
				// Once a sucessful ajax call has been made some defaults are changed and saved (getPackage ajax call)
				this.$el.prepend(view.render().el);														
			},

			addAll: function() {
			
				$(this.el).html("");
				//console.log(this.collection)
				//console.log(nzp.trackingPageCollection)
				
				// The issue is we reinstantiate the items which results in a new timestamp being created.
				//if (this.collection.length == 0) { // When woudl this occur
					nzp.trackingPageCollection.each(function(model){						
						var view = new nzp.TrackingItemView({model: model});					
						this.$el.append(view.render().el)							
					}, this);					
				//} else {
					// Loop over data and append to page	
				//}

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
		  'click #tracking-scan': 'scanItem' 
		},


		render:function() {

			this.$el.html(this.template({}));
			$trackingNo = this.$('#tracking-number');
			return this;
		},

		getPackage: function(e) {
			e.preventDefault();			
			// If the user has entered a value into the input box
				if($trackingNo.val() != "") {				
					var tCode = $trackingNo.val();
					this.processTrackingCode(tCode);
				};
		},

		// Scan item using PhoneGap barcode plugin
			scanItem: function(e) {
				e.preventDefault();
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
				)	
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

									if(item.toJSON().track_code != undefined) {								
										item.save({
											detail_description: data[userCode].detail_description, 
											short_description:  data[userCode].short_description, 
											events:             data[userCode].events,
	 										spinner:            ''
										}); // Save the item to the collection and set its spinner to blank            				    										
									} else {
										console.log('unsucessful code')
										item.save({
											error_code:         data[userCode].error_code, 
											detail_description: data[userCode].detail_description, 
											short_description:  data[userCode].short_description, 
											spinner:            ''
										}); // Save the item to the collection and set its spinner to blank            				    										
									}
								}
							}
						});
				};

			}			

	});