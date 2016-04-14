function Popup(el, options){
	var options = options || {};
	this.el = el;
	this.isShowed = false;
	var self = this;
	this.trigger = options.trigger || "hover";
	var trigger = this.trigger;
	if(CCO.isMobile() && Modernizr.touch) trigger="touchend";
	else if (CCO.isMobile()) trigger = "click";

	// trigger = "click";
	if(trigger != "hover") {
		$(".popup-trigger",el).on("click",function(e){
			return false;
		})
		$(".popup-trigger",el).on(trigger,function(e){
			self.toggle();
			return false;
		});
	} else {
		$(el).on("mouseover", function(){
			self.show();
		});

		$(el).on("mouseout", function(){
			self.hide();
		});
	}

	$(".accessible-popup", el).on("click", function(e){
		self.toggle();
		return false;
	});

	$(".popup-content", el).on("keyup",function(e){
		if(e.which == 27) {
			self.hide();
			$(".popup-trigger", el).focus();
		}
	});

	$(el).on("click touchend", function(e){
		e.stopPropagation();
	});

	$(".popup-trigger",el).on("keydown",function(e){
		if (e.which == 32) {
			self.toggle();
			return false;
		} else if (e.which == 27) {
			self.hide();
			return false;
		}
	});

	this.init();
}

Popup.prototype = {
	init: function(){
		var el = this.el;
		$(".popup-trigger", el).attr("aria-expanded", "false");
		if(!$(".popup-trigger", el).attr("href"))
			$(".popup-trigger", el).attr("href", "#"+$(".popup-content",el).attr("id"));
		$(".popup-trigger", el).attr("aria-controls", $(".popup-content",el).attr("id"));

		$(".popup-trigger", el).append('<button class="accessible-popup">Expand</button><button class="accessible-popup collapse">Collapse</button>');

		$(".accessible-popup", el).attr("aria-expanded", "false");
		$(".accessible-popup", el).attr("aria-controls", $(".popup-content",el).attr("id"));
		$(".accessible-popup", el).append("<span class='visuallyHidden'> "+$(".popup-trigger", el).text()+"</span>");

		$(".popup-content", el).attr("aria-hidden", "true");
	},
	show: function(noFocus){
		var $el = $(this.el);
		var self = this;
		var windowWidth = window.innerWidth;
		
		if(this.isShowed || 
			$(".popup-content", $el).length < 1 || 
			$(".popup-content", $el).outerWidth() <= 0 || 
			windowWidth<=CCO.breakpoint) 
			return;

		CCO.nav.hideAllPopup();

		$el.addClass("active");
		$(".popup-content", $el).attr("aria-hidden", "false");
		$(".popup-trigger", $el).attr("aria-expanded","true");
		$(".accessible-popup", $el).attr("aria-expanded","true");
		this.isShowed = true;
	},
	hide: function(){
		var $el = $(this.el);
		var self = this;
		var windowWidth = window.innerWidth;
		
		if(!this.isShowed || 
			windowWidth<=CCO.breakpoint) 
			return;
		$el.removeClass("active");
		$(".popup-content", $el).attr("aria-hidden", "true");
		$(".popup-trigger", $el).attr("aria-expanded","false");
		$(".accessible-popup", $el).attr("aria-expanded","false");
		this.isShowed = false;
	},
	toggle: function(){
		var $el = $(this.el);
		var self = this;

		if(this.onTrigger) this.onTrigger(this);
		if(!this.isShowed) {
			this.show();
			$(".popup-content", $el).attr("tabindex", "-1").focus();
		} else {
			this.hide();
			$(".popup-trigger", $el).focus();
		}
	},
}

$.fn.popup = function(options){
	return this.each(function(){
		var popup = new Popup(this, options);
		jQuery.data(this, "popup", popup);
	});
}