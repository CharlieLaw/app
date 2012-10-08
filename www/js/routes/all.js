/*

	Thing still to do in tracking
	* Validate user entry
	* Edit of name in the description page, the list should update when the user navigates back to it
	* Barcode scanner
	* Switch between number and text for codes
	* Send details via Email
	* Item List will initialy be pulled from Local storage, so we need a way to refresh this list
	* Item Details will initialy be pulled from Local storage, so we need a way to refresh this list
	* Sync local storage with server
		* Prevent duplicates within the Local storage array
	* If duplicates are searched for highlight the one the user searched on, or re search
	* Sort local storage so the newest item is always shown first
	* Add to the list instead of creating a new list everytime
		* Abitlity to delete record from the details page
	* What to do when there is no local storage available

	* Slide animation
	* Templating solution via require.js
	* Local storage should be event driven from changes to the collection, I have not done this correctly
	* When you add the name on the tracking desc page, the event is lost to open the from again
	* Zobmies, Do I have any

*/

nzp.Router = Backbone.Router.extend({


		routes: {
						   		   '' : 'home',
						  'index.html': 'home',
						     'locator': 'locator',			  
						    'tracking': 'trackingList',
					    'tracking/:id': 'trackingDetails',
						     'contact': 'contact',
						     //'mappage': 'mappage',
	  	 	 	 'locator/closest/:id': "locatorDetails",
 	'locator/closest/:id/:travel_mode': "directionsPage",
		 'locator/nearby/:place_type' : "nearbyPage",
		    		  'locatorrefresh': 'locatorRefresh'
		},

		initialize: function(options) {	
		},

/********************************************************************************************************
	Site home page
********************************************************************************************************/

		
		home: function() {

			// Empty the page before putting new content in				
				//nzp.$page.empty();		
			
			// Set page title, body class & previuos page								
				nzp.headerTitle.set({title: 'New Zealand Post'});				
				nzp.$body.attr('id', 'home');

			// Instantiate the model	
				var homePage = new nzp.Nav(navigationData);					
				var homePageView = new nzp.HomePageView({
					model: homePage
				});					
					
			// Show page, passed via the event application object	
				nzp.appView.showView(homePageView);
			
			// Attach fastclick to wrapper element	
				// var clickPage = document.getElementById('home-page');
				// if(clickPage) {
				// 	new FastClick(clickPage);	
				// };

			// hide spinner
				nzp.$loading.hide();
					

		},
		
/********************************************************************************************************
	Locator home page
********************************************************************************************************/		

		locator:function () {
			
			// Empty the page before putting new content in				
				//nzp.$page.empty();												
				var isOnline = checkStatus();
				
				// If the user is offline check local storage

				if (isOnline) {
				
					// Set page title, body class & previuos page								
						nzp.headerTitle.set({title: 'NZ Post Nearby'});								
						nzp.$body.attr('id', 'locator');

					// Get the users current location	
						getLocation(this.getLocation);

					// Set previous page	
						this.previousPage = '';										

					// Attach fastclick to wrapper element	
						// var clickPage = document.getElementById('locator-page');
						// if(clickPage) {
						// 	new FastClick(clickPage);	
						// };
				} else {
					//nzp.$offline.show();
					console.log(nzp.placesCollection)
					nzp.router.navigate('', {trigger:true});
				}			
		},

		
		locatorRefresh:function () {

			// Set to true so the getLocation function is aware that it has to get the itmes once more
				nzp.refreshMe = true;
												
			// Empty the page before putting new content in				
				nzp.$page.empty();												

			// Show the spinner while getting new items	
				nzp.$loading.show();

			// Get the users current location	
				getLocation(this.getLocation);

			// Set previous page	
				this.previousPage = '';										

			// Attach fastclick to button element	
				var clickPage = document.getElementById('tracking-refresh');
				if(clickPage) {
					new FastClick(clickPage);	
				};				
		},		

		getLocation: function(pos) {
			
			// Empty the page before putting new content in				
				nzp.$page.empty();												

			
			//If the places collection is empty then a fetch will be required which can take some time so provide an animation			
				if(nzp.placesCollection.length == 0) {					
					nzp.$loading.show();
				} 
			
			// Set the lat and lng	
				nzp.placesCollection.lat = pos.coords.latitude;
				nzp.placesCollection.lng = pos.coords.longitude;

			// Instantiate a new placeListView		
				nzp.placeListView = new nzp.LocatorPageView({	
					collection: nzp.placesCollection
				});					
		
				console.log(nzp.placesCollection)		

			// If the collection has no item, then a fetch has taken place so there may be a delay				
				if(nzp.placesCollection.length == 0 || nzp.refreshMe == true) {
					nzp.placesCollection.fetch({
						success: function(collection, response) {								
							console.log('route 1');
							nzp.appView.showView(nzp.placeListView);
							nzp.appView.hideSpinner();
							nzp.refreshMe = false; // Set back to false in case this was a refresh event							
						}
					});
				} else {	
					//console.log('route 2');												
					//nzp.$page.html(nzp.placeListView.render().el);
					nzp.appView.showView(nzp.placeListView);					
					nzp.appView.hideSpinner();
				};								
		},


// 		getLocation2: function(pos) {
// 			console.log(pos)
// 			// Empty the page before putting new content in				
// 				nzp.$page.empty();												

			
// 			//If the places collection is empty then a fetch will be required which can take some time so provide an animation			
// 				if(nzp.placesCollection.length == 0) {					
// 					nzp.$loading.show();
// 				} 
			
// 			// Set the lat and lng	
// 				nzp.placesCollection.lat = pos.coords.latitude;
// 				nzp.placesCollection.lng = pos.coords.longitude;

// 			// Instantiate a new placeListView		
// 				nzp.placeListView = new nzp.LocatorPageView({	
// 					collection: nzp.placesCollection
// 				});					
		
// 				//console.log(nzp.placesCollection)		
// 				// Need to do an AJAX call and populate localstorage
// var placesUrl = 'http://api.nzpost.co.nz/locator/api/locations?api_key=a7f0c7b0b123012f06d2000c29b44ac0&type=Postbox+Lobby&type=Dropbox&type=Postbox&type=PostShop&type=ATM&type=Business+Banking+Centre&nearby_latitude='+nzp.placesCollection.lat+'&nearby_longitude='+nzp.placesCollection.lng+'&max=30&format=jsonp&callback=?';				
// $.jsonp({													
// 	'url': placesUrl,
// 	'timeout': '10000',										
// 	'success': function(data) {											
// 		console.log(data)
// 		// var userCode = tCode.toUpperCase();
// 		// if(data[userCode] != undefined) {
// 		// 	saveDetails(item, data[userCode], userCode, true);
// 		// 	nzp.$body.removeClass('norefresh'); // Theres something added so show the refresh button
// 		// };								
// 	}, 
// 	'error': function() {
// 		console.log('pish')
// 		//saveDetailsOffline(item);										
// 	}
// });			



// 			// If the collection has no item, then a fetch has taken place so there may be a delay				
// 				if(nzp.placesCollection.length == 0 || nzp.refreshMe == true) {
// 					nzp.placesCollection.fetch({
// 						success: function(collection, response) {								
// 							console.log(collection)
// 							// console.log('route 1');
// 							// nzp.appView.showView(nzp.placeListView);
// 							// nzp.appView.hideSpinner();
// 							// nzp.refreshMe = false; // Set back to false in case this was a refresh event							
// 						}
// 					});
// 				} else {	
// 					//console.log('route 2');												
// 					//nzp.$page.html(nzp.placeListView.render().el);
// 					nzp.appView.showView(nzp.placeListView);					
// 					nzp.appView.hideSpinner();
// 				};								
// 		},						

/********************************************************************************************************
	Locator Place Detail Page
********************************************************************************************************/

		locatorDetails:function (id) {

			var isOnline = checkStatus();
			if (isOnline) {

				// Empty the page before putting new content in				
					nzp.$page.empty();												
					nzp.$page.removeClass("map");
					$('.tabbar').remove(); // if the tabbar is presenet remove it

				// Set page title, body class & previuos page								
					nzp.headerTitle.set({title: 'Details'});								
					nzp.$body.attr('id', 'locator-details');
			
				/*				
					No need for geo location as we get the location based on the ID					
					The collection will exist as its initialised on page load, 
						
					If the collection has a length then the user is browsing
						Use the existing collection, grab the details from there and append to page
					If the collection has no length then they have come directly to the URL	
						Fetch a new item and add it to the collection

					
					so test its length to see if there's a match an item from the collection
					or load a new item and add it to the collection
				*/

					if (nzp.placesCollection.length == 0){				
						
						var singleItem = new nzp.Place({id: id});
						var singleItemCollection = new nzp.PlacesSingle({
							model: singleItem
						});
						
						// Fetch the itme with matching ID
							singleItemCollection.fetch({							
								success: function(collection, response) {								
									// Add item to collection
										nzp.placesCollection.add(collection.models[0]);
										nzp.router.placeDetails(collection.models[0]);
								}, 
								error: function(collection, response) {
									nzp.$page.html('<div class="msg page"><p>No place found.</p><p>Please check the URL is correct</p></div>');
								}							
							}, this);

					} else {
			          	
			          	// Find the item in the existing collection
				          	var col = nzp.placesCollection.find(function(item) {
								return item.get("id") == id;
							});		
							nzp.router.placeDetails(col);											
					}

				// Set previous page	
					this.previousPage = 'locator';										

				// Attach fastclick to wrapper element	
					var clickPage = document.getElementById('locator-details-page');
					if(clickPage) {
						new FastClick(clickPage);	
					};	

			} else {
				nzp.$offline.show();
				nzp.router.navigate('', {trigger:true});			
			};	

		},	

		placeDetails: function(c) {
			var locatorDetails2 = new nzp.LocatorDetailView({
				collection: c
			})//.render();
			nzp.appView.showView(locatorDetails2);
			//nzp.$page.append(locatorDetails2.el);
		},

/********************************************************************************************************
	All Places Nearby Map
********************************************************************************************************/


	nearbyPage: function(place_type){
		
		var isOnline = checkStatus();
		if (isOnline) {

			var self = this;
			
			nzp.nearby_type = unescape(place_type);
		
			if (nzp.placesCollection.isEmpty()){
				
				getLocation(function(pos){				
					nzp.placesCollection.lat = pos.coords.latitude;
					nzp.placesCollection.lng = pos.coords.longitude;

					nzp.placesCollection.fetch({
						success: self.showNearby
					});
				});

			} else {
				this.showNearby(nzp.placesCollection);
			};

		} else {
			nzp.$offline.show();
			nzp.router.navigate('', {trigger:true});			
		};

	},

    showNearby: function(collection){      
      nzp.$page.empty();

		// Set page title, body class & previuos page								
			nzp.headerTitle.set({title: nzp.nearby_type});								
			nzp.$body.attr('id', 'map-all');
			nzp.router.previousPage = 'locator';		


	  var place = new nzp.Place();
      var setMap = new mapAll({
        model: place,
        collection: collection
      });

      createTab = new nzp.TabCollection(AllMarkersTabsData);      
      var createTabView = new nzp.TabView({
      	collection: createTab, 
      	el:'<ul id="posttype" class="tabbar tabbar-posttype grad-mask">', 
      	tabtype: 'allmarkers'
      }); // Add data models to the collection
      
      // Cant use event aggregator as it appends to differnt element
      nzp.$wrapper.append(createTabView.render().el)
      
      
      setMap.render();

      var selectedTab = createTab.find(function(tab){
        return tab.get("title") == nzp.nearby_type;
      });
      selectedTab.set("highlighted", true);


	//Attach fastclick to all map element, others are handled with fastclick (NOT FT version)
		var clickPage = document.getElementById('all-map');
		if(clickPage) {
			new FastClick(clickPage);	
		};		

    },

/********************************************************************************************************
	Directions Map, get the place and travel mode	
********************************************************************************************************/


	directionsPage: function(id,travel_mode){
	
		var isOnline = checkStatus();
		if (isOnline) {

			nzp.$loading.show();
			var place;		
			// Get the currect travel mode (walking or driving)
				nzp.travel_mode = travel_mode;      
				
			// If the place is already part of a collection use it from there
				if (nzp.placesCollection){		
					place = nzp.placesCollection.get(id);        
				};
			
			// If place is undefined fetch the colllection, then show the place
				if (place == undefined){
					place = new nzp.Place({id: id});
					place.fetch({
						success: this.showPlace
					});

				} else {						
					this.showPlace(place)
				};

		} else {
			nzp.$offline.show();
			nzp.router.navigate('', {trigger:true});
		};			

	},

// Show directions
	showPlace: function(place){
		
		nzp.current_place = place;
		//console.log(nzp.current_place)
		getLocation(function(pos){
			
			nzp.$page.empty();
			// Set page title and body class
				nzp.headerTitle.set({title: nzp.tabTitle});
				nzp.$body.attr('id', 'map-directions');
				
			// Instantiate new map and render it
				var setMap = new nzp.MapDirections({
					model: place
				});
				setMap.coords =  pos.coords;
				setMap.render();
			
			// Set previous page
				nzp.router.previousPage = 'locator/closest/' + place.toJSON().id;		

			// Set the selected tab
				var createTab = new nzp.TabCollection(DirectionTabsData);

				var createTabView = new nzp.TabView({
					collection: createTab, 
					el:'<ul id="mode" class="tabbar tabbar-mode grad-mask">', 
					tabtype: 'travelroute'
				});
				nzp.$wrapper.append(createTabView.render().el);

				var selectedTab = createTab.find(function(tab){
					return tab.get("slug") == nzp.travel_mode;
				});
				selectedTab.set("highlighted", true);

			// Attach fastclick to wrapper element	
				// var clickPage = document.getElementById('mode');
				// if(clickPage) {
				// 	new FastClick(clickPage);	
				// };		


		});
	},
		

	


		trackingList: function() {

			// Empty the page before putting new content in				
				nzp.$page.empty();
				
			// Set page title and body class
				nzp.headerTitle.set({title: 'Tracking'});								
				nzp.$body.attr('id', 'tracking');	

			// Initalise a form for user input and append it to the page
				var trackingForm = new nzp.TrackingForm();
				var trackingFormView = new nzp.TrackingFormView({
					model:trackingForm,
					collection: nzp.trackingPageCollection,
					el: '<div id="tracking-page" class="page">'
				}).render();
				nzp.appView.showView(trackingFormView, true);


				//nzp.$page.html(trackingFormView.el);

			// Initalise the <ul> which contain all of the <li> tracking codes
		        	
			        nzp.trackingPageCollection.fetch({
			        	success: function() {

						// If the view does not exist already
							if (nzp.trackingPageView == undefined){

								var trackingPage = new nzp.TrackingPage();

								nzp.trackingPageView = new TrackingPageView({
								 	model: trackingPage,
								 	collection: nzp.trackingPageCollection
								});
								
								$('#tracking-form').after(nzp.trackingPageView.render().el);
								//nzp$.page.append(nzp.trackingPageView.render().el);
								//nzp.appView.showView(nzp.trackingPageView);
								//nzp.appView.showView(nzp.trackingPageView);
								if(nzp.trackingPageCollection.length > 0) {
									nzp.trackingPageCollection.models[0].save({spinner: ''});
								}

							}	else {
								// Required to insure the list comes before the buttons
								$('#tracking-form').after(nzp.trackingPageView.render().el);
							}		        		
			        	}
			        }, this);			
			
			// Set previous page
				this.previousPage = '';

			// Attach fastclick to wrapper element	
				// var clickPage = document.getElementById('tracking-page');
				// if(clickPage) {
				// 	new FastClick(clickPage);	
				// };
				
			
				
		},

		trackingDetails: function(id) {
			nzp.$page.empty();
			/*
			Fetch the tracking page collection
			Loop over the collection and render a matching record
			If no match is found or no records are found display an error message
			*/
			// Set page title, body class & previuos page								
			//nzp.headerTitle.set({title: id});	
			nzp.headerTitle.set({title: 'Package details'});				
			nzp.$body.attr('id', 'tracking-details')
			this.previousPage = 'tracking';


			if (nzp.trackingPageCollection.length == 0){
				nzp.trackingPageCollection.fetch();
			};
			
			if (nzp.trackingPageCollection.length > 0) {
				model = nzp.trackingPageCollection.find(function(item){
				return item.get("track_code") == id;
				});

				if (model){
					
					nzp.trackingDetailsForm = new nzp.TrackingDetailsForm({
						model: model						
					});

					nzp.trackingDetails = new nzp.TrackingDetails({
						model: model						
					});
					//console.log(nzp.userName)
					nzp.userName = new nzp.TrackingDetailsUserName({
						model: model						
					})

					var details = $(nzp.userName.render().el).after(nzp.trackingDetails.render().el)
					var allContent = $(nzp.trackingDetailsForm.render().el).after(details);
					nzp.$page.html(allContent);


				} else {
					nzp.$page.html('<div class="msg page"><p>This record does not match the ones you have stored.</p><p>Please check the URL is correct</p></div>');
				};

			} else {
				nzp.$page.html('<div class="msg page"><p>You dont have any tracking items stored</p></div>');
			};


		},


		contact: function() {
			nzp.$page.empty(); 								// Empty the page before putting new content in
			var contactPageView = new nzp.ContactPageView({});
			
			//nzp.$page.html(contactPageView.el);
			nzp.appView.showView(contactPageView);

			/* Set page title and body class */
				nzp.headerTitle.set({title: 'Contact'});
				nzp.$body.attr('id', 'contact');
				this.previousPage = '';

			// Attach fastclick to wrapper element	
				var clickPage = document.getElementById('contact-page');
				if(clickPage) {
					new FastClick(clickPage);	
				};				
		}

	});
