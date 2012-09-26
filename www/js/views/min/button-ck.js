/* ---------------------------------------------------------------------------------------------------------
 
 	Header Buttons

 	* ButtonView 		- Wrapper for all butons elements within the header
 	* SingleButtonView 	- Individual button with different click events for each

 
---------------------------------------------------------------------------------------------------------*//********************************************************************************************************
	ButtonView
********************************************************************************************************/nzp.ButtonsView=Backbone.View.extend({tagName:"ul",className:"buttons",initialize:function(){_.bindAll(this,"render")},render:function(){_.each(this.model.attributes,function(e){var t=new nzp.SingleButtonView({model:e});this.$el.append(t.render().el)},this);return this}});nzp.SingleButtonView=Backbone.View.extend({tagName:"li",events:{"click a":"clicked"},initialize:function(){_.bindAll(this,"render")},clicked:function(e){e.preventDefault();switch(this.model.slug){case"home":console.log("home button clicked");break;case"menu":nzp.$body.toggleClass("active");break;case"back":nzp.router.navigate(nzp.router.previousPage,!0);nzp.$page.removeClass("map");nzp.$body.removeClass("showform");$(".tabbar").remove();break;case"scan":window.plugins.barcodeScanner.scan(function(e){e.cancelled?alert("the user cancelled the scan"):processTrackingCode(e.text)},function(e){console.log(e);alert("scanning failed: "+e)});break;default:nzp.router.navigate("",!0)}},render:function(){var e=_.template("<a href='#' class='<% print(classname); %>'><% print(title); %></a>"),t=e({classname:this.model.classname,title:this.model.title});this.$el.html(t);return this}});