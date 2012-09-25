/* Locator Detals - This model is used when the user enters the URL directly otherwise a collection will already exist */
nzp.LocatorDetailsSinglePage = Backbone.Model.extend({				
	
	defaults: {	
		apiKey:'a7f0c7b0b123012f06d2000c29b44ac0'
	},

	url:function(){      			
		return 'http://api.nzpost.co.nz/locator/api/details/api_key='+this.get('apiKey')+'&id='+this.get('id');
	},

	parse: function(response){         	
		/*
		var attrs = {
			postshop:      [],
			postbox:       [],
			postboxlobby:  [],
			postother:     [],
			closestPlaces: []					
		};
		
		// Assign each type to its own array				
			_.each(response, function(item){  				 						
			  	switch(item.type.toLowerCase()) {
				case 'postshop':							  
				  attrs.postshop.push(item);
				  break;
				case 'postbox':
				  attrs.postbox.push(item);
				  break;
				case 'postbox lobby':
				  attrs.postboxlobby.push(item);
				 break;						  
				default:
				  attrs.postother.push(item);
				}					
			}, this);

		// Create a closest Places array of objects from the first item of each type which will be the closest item
			if (attrs.postshop && attrs.postshop.length > 0) {
				attrs.closestPlaces.push(attrs.postshop[0]);						
			}
			if (attrs.postbox && attrs.postbox.length > 0) {
				attrs.closestPlaces.push(attrs.postbox[0]);
			}
			if (attrs.postboxlobby && attrs.postboxlobby.length > 0) {
				attrs.closestPlaces.push(attrs.postboxlobby[0]);
			}
			if (attrs.postother && attrs.postother.length > 0) {
				attrs.closestPlaces.push(attrs.postother[0]);
			} 
  			return attrs;
  		*/
	},
});		
