//(function ($) {

// Attache fastclick to the html element
// this will bubble up to allow event delegation
// If the body does not have a map class then carry out with the fastclick, otherwise no fastclick	
	
nzp.AppView = Backbone.View.extend({
	
	el: $('body'),

	initialize: function(){		
		
	// Cache JQUery objects commonly used 			
		nzp.$body 	 = this.$el;			
		nzp.$loading = $('#loading');			
		nzp.$wrapper = $('#wrapper');
		nzp.$wrapper2 = $('#wrapper2');			
		nzp.$header  = $('#header');
		nzp.$page    = $('#pages');

		_.bindAll(this, "render");		
	},

  	//events: {
		//"click a": "fastClicked"
	//},	

	render: function() {

		//checkOnLine();

		/* Header Area */
			var header = new nzp.Header();
			nzp.headerView = new nzp.HeaderView({
				model: header, 
				el: nzp.$header
			});						
			
		// Flyout Menu
			var flyoutMenu = new nzp.Nav(navigationData);	
			nzp.flyoutMenuView = new nzp.MenuView({
				model: flyoutMenu,
				tagName: 'ul',
				id: 'flyout-menu'
			});	
						
		// Header
			this.$el.prepend(
				nzp.headerView.render().el, 
				nzp.flyoutMenuView.render().el				
			);
			nzp.$loading.removeClass('show');

		// Stuff required for app loading
			this.previousPage = '';

		// Initialise Tracking Local Storage Collection
			nzp.trackingPageCollection = new nzp.TrackingPageCollection;

		// Location Page Collection
			nzp.placesCollection = new nzp.Places;
		
		// Fast Click to remove 300ms delay			
			//new FastClick(document.getElementById('header')); // This needs disabled for the map page 						
		
			//var clickPage = document.getElementsByTagName('body')[0];
			//console.log(clickPage)
			//if(clickPage.) {
			//	new FastClick(clickPage);	
			// };
			
			//var p = document.getElementById('pages')
			//new FastClick(p)

		// Fire router & history 
			nzp.router = new nzp.Router;
			Backbone.history.start();	
	}, 

	
	fastClicked: function(e) {
		e.preventDefault();
		//var $target = $(e.target)
		//if ($target.hasClass('fc')) {		  
		  new FastClick(this.$el);
			//console.log(e.target)
		//}
	},

	// Manage view transitions without fear of the zombies
	// http://lostechies.com/derickbailey/2011/09/15/zombies-run-managing-page-transitions-in-backbone-apps/

	showView: function(view) {
 		
		if (this.currentView){
			this.currentView.close();
		}

		this.currentView = view;
		this.currentView.render();

		nzp.$page.html(this.currentView.el);
	},

	hideSpinner: function() {
		setTimeout(function() {
			nzp.$loading.hide();
		}, 300);
	}

});




	//$(function() {
			

			//nzp.appView = new nzp.AppView;
			//nzp.appView.render();
			


				
	//});

//} (jQuery));


/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    // function, we must explicity call `app.receivedEvent(...);`
    onDeviceReady: function() {
        	nzp.appView = new nzp.AppView;
			nzp.appView.render();
        //app.receivedEvent('deviceready');        
    }
   
};








// Check if object is object
	function IsObject(obj){
	  return obj ? true : false;
	}

// Get time in correct format
  function toDate(dStr,format) {
        var now = new Date();
        if (format == "h:m") {
          now.setHours(dStr.substr(0,dStr.indexOf(":")));
          now.setMinutes(dStr.substr(dStr.indexOf(":")+1));
          now.setSeconds(0);
          return now;
        }else 
          return "Invalid Format";
      }

// Check if the user if on or offline
	function checkOnLine() {
		var statusElem = document.getElementsByTagName('html')[0]
		setInterval(function () {
		  statusElem.className = navigator.onLine ? 'online' : 'offline';
		  //statusElem.innerHTML = navigator.onLine ? 'online' : 'offline';  
		}, 250);		
	}


Backbone.View.prototype.close = function(){
  this.remove();
  this.unbind();
  if (this.onClose){
    this.onClose();
  }
}
		