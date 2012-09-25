
	/* Home Page */		
		nzp.HomePageCollection = Backbone.Collection.extend({
			model: nzp.HomePage,			
		});	

	/* Home Page */		
		nzp.HomePageCollection2 = Backbone.Collection.extend({
			model: nzp.HomePage2,						
			localStorage: new Backbone.LocalStorage("navigation")
		});	

		
