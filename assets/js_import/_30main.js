var App = (function(){
	return {
		init: function(){
			this.bootstrap();
			for(var i in this) {
				if(typeof this[i] == "object") this[i].init();
			}
		},
		bootstrap: function(){
			$("[data-toggle=tooltip]").tooltip();
		}
	};
}());