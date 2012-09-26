/* ---------------------------------------------------------------------------------------------------------
 
 	Application Header

 	* HeaderView 		- Wrapper for all header elements
 	* HeaderTitleView2 	- Header title text

 
---------------------------------------------------------------------------------------------------------*//********************************************************************************************************
	HeaderView
********************************************************************************************************/nzp.HeaderView=Backbone.View.extend({initialize:function(){_.bindAll(this,"render")},render:function(){nzp.headerTitle=new nzp.HeaderTitle;var e=new nzp.HeaderTitleView({model:nzp.headerTitle}),t=new nzp.Button(buttonsData),n=new nzp.ButtonsView({model:t});this.$el.append(e.render().el);this.$el.append(n.render().el);return this}});nzp.HeaderTitleView=Backbone.View.extend({tagName:"h1",initialize:function(){_.bindAll(this,"render","updateTitle");this.model.bind("change:title",this.updateTitle)},render:function(){this.$el.html(this.model.toJSON().title);return this},updateTitle:function(){this.$el.text(this.model.toJSON().title);return this}});