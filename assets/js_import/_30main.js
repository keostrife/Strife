var App = (function($){
	return {
		init: function(){
			for(var i in this) {
				if(typeof this[i] == "object") this[i].init();
			}
		}
	};
}(jQuery));