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
			  //  		   '' : 'home',
			  // 'index.html': 'home',

			   		   '' : 'home',
			  'index.html': 'home',
			     'locator': 'locator',
			  //'ratefinder': 'ratefinder',
			    'tracking': 'trackingList',
		    'tracking/:id': 'trackingDetails',
			     'contact': 'contact',
			     'mappage': 'mappage',
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

		/*
		home: function() {
			// Empty the page before putting new content in				
				nzp.$page.empty();		
			
			// Set page title, body class & previuos page								
				nzp.headerTitle.set({title: 'New Zealand Post'});				
				nzp.$body.attr('id', 'home');


			// Instantiate the home page using the navigation data

			// Check if the navigation data is stored in local storage 
				nzp.homePage = new nzp.Nav(navigationData);

				if(nzp.homePageView == undefined) {
					console.log('using collection')
					nzp.homePageView = new nzp.HomePageView({
						model: nzp.homePage
					});					
				}
				nzp.homePageView.render();				
				nzp.$page.append(nzp.homePageView.el);
			
			// Attach fastclick to wrapper element	
				var clickPage = document.getElementById('home-page');
				if(clickPage) {
					new FastClick(clickPage);	
				};

			//setTimeout(function() {
				nzp.$loading.hide();
			//}, 500)
					

		},*/

		home: function() {

			// Empty the page before putting new content in				
				nzp.$page.empty();		
			
			// Set page title, body class & previuos page								
				nzp.headerTitle.set({title: 'New Zealand Post'});				
				nzp.$body.attr('id', 'home');

			// Instantiate the model	
				var homePage = new nzp.Nav(navigationData);					
				var homePageView = new nzp.HomePageView({
					model: homePage
				});					
					
			// Show page, passed via the event application object	
				nzp.appView.showView(homePageView)
			
			// Attach fastclick to wrapper element	
				var clickPage = document.getElementById('home-page');
				if(clickPage) {
					new FastClick(clickPage);	
				};

			// hide spinner
				nzp.$loading.hide();
					

		},
		
/********************************************************************************************************
	Locator home page
********************************************************************************************************/		

		locator:function () {
			
			// Empty the page before putting new content in				
				nzp.$page.empty();												

			// Set page title, body class & previuos page								
				nzp.headerTitle.set({title: 'NZ Post Nearby'});								
				nzp.$body.attr('id', 'locator');

			// Get the users current location	
				getLocation(this.getLocation);

			// Set previous page	
				this.previousPage = '';										

			// Attach fastclick to wrapper element	
				var clickPage = document.getElementById('locator-page');
				if(clickPage) {
					new FastClick(clickPage);	
				};			
		},

		
		locatorRefresh:function () {

			// Set to true so the getLocation function is aware that it has to get the itmes once more
				nzp.refreshMe = true;
				
			// Show the spinner while getting new items	
				nzp.$loading.show();
								
			// Empty the page before putting new content in				
				nzp.$page.empty();												

			// Get the users current location	
				getLocation(this.getLocation);

			// Set previous page	
				this.previousPage = '';										

			// Attach fastclick to wrapper element	
				var clickPage = document.getElementById('locator-page');
				if(clickPage) {
					new FastClick(clickPage);	
				};				
		},		

		getLocation: function(pos) {
			
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
		
							
			// If the collection has no item, then a fetch has taken place so there may be a delay				
				if(nzp.placesCollection.length == 0 || nzp.refreshMe == true) {
					nzp.placesCollection.fetch({
						success: function(collection, response) {								
							nzp.appView.showView(nzp.placeListView);
							nzp.appView.hideSpinner();
							nzp.refreshMe = false; // Set back to false in case this was a refresh event							
						}
					});
				} else {													
					//nzp.$page.html(nzp.placeListView.render().el);
					nzp.appView.showView(nzp.placeListView);					
					nzp.appView.hideSpinner();
				};								
		},		

/********************************************************************************************************
	Locator Place Detail Page
********************************************************************************************************/

		locatorDetails:function (id) {

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
								//console.log('Not firing on error, must investigate')
								//return console.log('Why not firing');
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

		},	

		placeDetails: function(c) {
			var locatorDetails2 = new nzp.LocatorDetailView({
				collection: c
			}).render();
			nzp.$page.append(locatorDetails2.el);
		},

/********************************************************************************************************
	All Places Nearby Map
********************************************************************************************************/


	nearbyPage: function(place_type){
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

	},

    showNearby: function(collection){      
      nzp.$page.empty();

		// Set page title, body class & previuos page								
			nzp.headerTitle.set({title: nzp.nearby_type});								
			nzp.$body.attr('id', 'map-all');
			nzp.router.previousPage = 'locator';		


      var setMap = new mapAll({
        collection: collection
      });

      createTab = new nzp.TabCollection(AllMarkersTabsData);      
      var createTabView = new nzp.TabView({
      	collection: createTab, 
      	el:'<ul id="posttype" class="tabbar tabbar-posttype grad-mask">', 
      	tabtype: 'allmarkers'
      }); // Add data models to the collection
      
      
      nzp.$wrapper.append(createTabView.render().el)
      
      

      setMap.render();
      //nzp.router.previousPage = 'locator';
      //headerTitle.set({title: nzp.nearby_type});
      //nzp.$body.attr('id', 'locator');
      //console.log(nzp.nearby_type)
      var selectedTab = createTab.find(function(tab){
        return tab.get("title") == nzp.nearby_type;
      });
      selectedTab.set("highlighted", true);


		// Attach fastclick to wrapper element	
			var clickPage = document.getElementById('posttype');
			if(clickPage) {
				new FastClick(clickPage);	
			};		

    },

/********************************************************************************************************
	Directions Map, get the place and travel mode	
********************************************************************************************************/


	directionsPage: function(id,travel_mode){
		
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
				//console.log(place)
				place.fetch({
					success: this.showPlace
				});

			} else {						
				this.showPlace(place)
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
				nzp.router.previousPage = 'locator';			
				
			// Create tabs and append to the body wrapper 	
				var createTab = new nzp.TabCollection(DirectionTabsData);
				var createTabView = new nzp.TabView({
					collection: createTab, 
					el:'<ul id="mode" class="tabbar tabbar-mode grad-mask">', 
					tabtype: 'travelroute'
				});
				nzp.$wrapper.append(createTabView.render().el);

			// Set the selected tab
				var selectedTab = createTab.find(function(tab){
					return tab.get("slug") == nzp.travel_mode;
				});
				selectedTab.set("highlighted", true);

			// Attach fastclick to wrapper element	
				var clickPage = document.getElementById('mode');
				if(clickPage) {
					new FastClick(clickPage);	
				};		


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
				nzp.$page.html(trackingFormView.el);

			// Initalise the <ul> which contain all of the <li> tracking codes
		        	
			        nzp.trackingPageCollection.fetch({
			        	success: function() {
							//var self = this;
							
							// If the view does not exist already
								if (nzp.trackingPageView == undefined){
	
									var trackingPage = new nzp.TrackingPage();

									nzp.trackingPageView = new TrackingPageView({
									 	model: trackingPage,
									 	collection: nzp.trackingPageCollection
									});
									
									nzp.$page.append(nzp.trackingPageView.render().el);
									
									if(nzp.trackingPageCollection.length > 0) {
										nzp.trackingPageCollection.models[0].save({spinner: ''});
									}

								}			        		
			        	}
			        }, this);

		    	
		        //console.log(nzp.trackingPageCollection.length)

/*if(nzp.trackingPageCollection.length === 0) {

} else {
	if (nzp.trackingPageView == undefined){
		var trackingPage = new nzp.TrackingPage();
		nzp.trackingPageView = new TrackingPageView({
			model: trackingPage,
			collection: nzp.trackingPageCollection
		});
    }
    nzp.$page.append(this.trackingPageView.render().el)
}*/


	/*
	
	This is incorrect, fetch the collection
	check it length
	if its 0 then instantiate a new view
	if ite more than 0 then get those items and display it

	*/
				
		        






/*	

		        if (this.trackingPageView == undefined){
		    		var trackingPage = new nzp.TrackingPage();
					this.trackingPageView = new TrackingPageView({
						model: trackingPage,
						collection: nzp.trackingPageCollection
					});
		        }
		     // If the collection is already there then just append to the page, no need to fetch again   
		     	
		     	//console.log(nzp.trackingPageCollection)
				if(nzp.trackingPageCollection.length === 0) {
					nzp.trackingPageCollection.fetch({
					}); // Fetch items from Local Storage			
				} else {
					console.log(this.trackingPageView.render().el)
					nzp.$page.append(this.trackingPageView.render().el)
					//setTimeout(function() {
					//	view.model.save({spinner: ''});
					//}, 1000);						
				};

*/				
				
			
			// Set previous page
				this.previousPage = '';

			// Attach fastclick to wrapper element	
				var clickPage = document.getElementById('tracking-page');
				if(clickPage) {
					new FastClick(clickPage);	
				};


		},

		trackingDetails: function(id) {
			nzp.$page.empty();
			/*
			Fetch the tracking page collection
			Loop over the collection and render a matching record
			If no match is found or no records are found display an error message
			*/
			// Set page title, body class & previuos page								
			nzp.headerTitle.set({title: id});				
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
					

					//console.log(model)
					// var trackingPageView = new TrackingPageDetails({
					// 	model: model
					// }).render();
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



			// Attach fastclick to wrapper element	
/*			var clickPage = document.getElementById('tracking-details');			
			if(clickPage) {
				new FastClick(clickPage);			
			};				*/

		},


		


		//mappage: function() {
			//nzp.$page.empty(); 								// Empty the page before putting new content in


			// Set page title, body class & previuos page								
				//nzp.headerTitle.set({title: 'Map'});				
				//nzp.$body.attr('id', 'map')				
				//nzp.$page.html(MapPageView.el);		
				//this.previousPage = 'locator';			// Append the results to the page
		//},


		// ratefinder: function() {
		// 	nzp.$page.empty(); 								// Empty the page before putting new content in
		// 	nzp.$page.html('<p>Rate Finder</p>');

		// 	nzp.$page.html(nzp.MapPageView.el);	

		// 	// Set page title, body class & previuos page								
		// 		nzp.headerTitle.set({title: 'Rate Finder'});				
		// 		nzp.$body.attr('id', 'ratefinder')				
				
		// 		this.previousPage = '';				// Append the results to the page

		// },



		contact: function() {
			nzp.$page.empty(); 								// Empty the page before putting new content in
			var contactPageView = new nzp.ContactPageView({});
			
			nzp.$page.html(contactPageView.el);

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


		/*
		trackingList: function() {

			// Empty the page before putting new content in
				$page.empty();

			// Create a new instance of the trackinPage Model.
				// var trackingPage = new TrackingPage();
				// var trackingPageCollection = new TrackingPageCollection({model: trackingPage});
				// var trackingPageView = new TrackingPageView({
				// 	model: trackingPage,
				// 	collection: trackingPageCollection,
				// 	el: '<div id="tracking-page" class="page">'
				// }).render();

				var trackingPage = new TrackingPage();
				var trackingPageView = new TrackingPageView({
					model: trackingPage,
					el: '<div id="tracking-page" class="page">'
				}).render();


			// After all the processing insert the HTML into the page div
				$page.html(trackingPageView.el);

			// Set page title and body class
				headerTitle.set({title: 'Tracking'});
				$body.attr('id', 'tracking');
				this.previousPage = '';


		},*/


 		/*
		trackingDetails: function(id) {

			// Get items in Local Storage
				var savedCodes = LocalStorageCodes.findAll();				// Retrieve all Local Storage codes for tracking


			//	RETRIEVE ITEM FROM LOCAL STORAGE
			//		Loop over each item to check if the tracking code matches the value in the URL
			//		This is required to get the correct model to pass through to the display details from storage method
			//		It insures that the user will land on the detials page if they put the URL in directly or by clickin a list item link

				var noMatch = true;
				if(savedCodes.length > 0) {
					_.each(savedCodes, function (item) {
						if( id === item.track_code) {

							// Take the ID and use it to find the correct model
								var friendlyRouteId = 'tracking-'+item.id;
								var localModel = JSON.parse(localStorage.getItem(friendlyRouteId));
								var displayDetails = new DisplayDetailsFromStorage({
									model: localModel
								}).render();

							// Set page title and body class
								headerTitle.set({title: id});
								$body.attr('id', 'tracking');
								this.previousPage = 'tracking';

							// Set no match to flase as we have found a match
								noMatch = false;

						}
					}, this);
				} else {
					console.log('no items in local storage, fetch from server')
				}

				if(noMatch){
					$page.html('<div class="page"><p>No items matched from local storage, would you like to check the remote server</p></div>')

					// Set page title and body class
						headerTitle.set({title: 'Item not found'});
						$body.attr('id', 'tracking');
						this.previousPage = 'tracking';

				}
				//console.log(noMatch)//else {
				// What about when an item is not in local storage but we have other items
				// What about when we have no itmes in local storage at all





		//	var trackingPage = new TrackingPage();
		//	var trackingPage = new TrackingPageView2({
		//		model: trackingPage,
		//		el: '<div id="tracking-details" class="page">',
		//		tid: id
		//	});
		//	$page.html(trackingPage.render().el);



		},
		*/






	});
