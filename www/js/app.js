/* ---------------------------------------------------------------------------------------------------------
 
 	Application Wrapper

 	* ChromeView 		- Wrapper for all consistent page elements, header, menu

 
---------------------------------------------------------------------------------------------------------*/

// nzp.ChromeView = Backbone.View.extend({
	
// 	initialize: function(){		
// 		_.bindAll(this, "render");		
// 	},

// 	render: function() {

// 		/* Header Area */
// 			var header = new nzp.Header();
// 			nzp.headerView = new nzp.HeaderView({
// 				model: header, 
// 				el: nzp.$header
// 			});						
			
// 		// Flyout Menu
// 			var flyoutMenu = new nzp.Nav(navigationData);	
// 			nzp.flyoutMenuView = new nzp.MenuView({
// 				model: flyoutMenu,
// 				tagName: 'ul',
// 				id: 'flyout-menu'
// 			});	
						
// 		// Append Default view to page
// 			this.$el.prepend(
// 				nzp.headerView.render().el, 
// 				nzp.flyoutMenuView.render().el				
// 			);
// 			nzp.$loading.removeClass('show');

// 		// Stuff required for app loading
// 			this.previousPage = '';

// 		// Initialise Tracking Local Storage Collection
// 			nzp.trackingPageCollection = new nzp.TrackingPageCollection;

// 		// Location Page Collection
// 			nzp.placesCollection = new nzp.Places();
		
// 		// Fast Click to remove 300ms delay			
// 			new FastClick(document.getElementById('header')); // This needs disabled for the map page 						

// 	}, 

// 	showView: function(view) {
//  		if (this.currentView){
// 	      this.currentView.close();
// 	   	}

// 	   this.currentView = view;
// 	   this.currentView.render();

// 	   $("#page").html(this.currentView.el);
// 	}

// });

