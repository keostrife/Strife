/**
 * Custom Desktop Nav Popup jquery plugin
 * ===========
 *
 * .el = the html element
 * .show() = show content
 * .hide() = hide content
 * .toggle() = show/hide content
 * .isShowed (BOOL) = whether the popup is active
 * .onHide (callback) = is called BEFORE hiding content, return false will stop function
 * .trigger (string) = trigger type, default for "click", can be "hover", is forced to "click" on mobile and can be override using data-trigger attribute on the element
 * 
 * When initialized using jQuery: $(select).popup();
 * The object will be tied to the element itself using $.data with the name of "popup"
 * so to retrieve the object, use $.data(el,"popup");
 */

function Popup(el, options){

	var options = options || {};
	this.el = el;
	this.isShowed = false;
	var self = this;
	this.trigger = options.trigger || "hover";
	this.onHide = options.onHide || null;
	this.tooltipMode = $(this.el).hasClass("tooltip");
	var trigger = $(el).attr("data-trigger") || this.trigger;
	if(App.isMobile() && Modernizr.touch) trigger="touchend";
	else if (App.isMobile()) trigger = "click";

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
		if(e.which == 27 ||
			e.which == 37 ||
			e.which == 38) {
			self.hide();
			$(".popup-trigger", el).focus();
		}
	});

	$(el).on("click touchend", function(e){
		e.stopPropagation();
	});

	$("body").on("click touchend",function(){
		$(".popup").each(function(index, el){
			if($(el).hasClass("beta")) return true;
			var obj = $.data(el, "popup");
			obj.hide();
		});
	});

	//accessibility
	$(".popup-trigger",el).on("keydown",function(e){
		if(e.which == 37 || e.which == 38) {
			if(this != $("nav.desktop ul.top-level > li:first-child > a")[0]) {
				var prevParent = $(this).parent().prev();
				if (prevParent.hasClass("popup"))
					prevParent.find("> a.popup-trigger").focus();
				else
					prevParent.find("> a").focus();
			}
			
			return false;				
		} else if (e.which == 39 || e.which == 40) {
			if(this != $("nav.desktop ul.top-level > li:last-child > a")[0]) {
				var nextParent = $(this).parent().next();
				if (nextParent.hasClass("popup"))
					nextParent.find("> a.popup-trigger").focus();
				else
					nextParent.find("> a").focus();
			}
			return false;	
		} else if (e.which == 32) {
			self.toggle();
			return false;
		} else if (e.which == 27) {
			self.hide();
			return false;
		}
	});

	this.init();

	if(this.tooltipMode) {
		$(".popup-trigger", el).on("focus", function(){
			self.show();
		});

		$(".popup-trigger", el).on("blur", function(){
			self.hide();
		});
	}
}

Popup.prototype = {
	init: function(){
		var el = this.el;
		if(this.tooltipMode) {
			$(".popup-trigger", el).attr("tabindex", 0);
			$(".popup-content", el).attr("role","tooltip");
		} else {
			$(".popup-trigger", el).attr("aria-expanded", "false");
			if(!$(".popup-trigger", el).attr("href"))
				$(".popup-trigger", el).attr("href", "#"+$(".popup-content",el).attr("id"));
			$(".popup-trigger", el).attr("aria-controls", $(".popup-content",el).attr("id"));
			$(".accessible-popup", el).attr("aria-expanded", "false");
			$(".accessible-popup", el).attr("aria-controls", $(".popup-content",el).attr("id"));
		}
		$(".popup-content", el).attr("aria-hidden","true");
	},
	show: function(noFocus){
		var $el = $(this.el);
		var self = this;
		var windowWidth = window.innerWidth;
		
		if(this.isShowed || 
			$(".popup-content", $el).length < 1 || 
			$(".popup-content", $el).outerWidth() <= 0) 
			return;
		

		$el.addClass("active");
		$(".popup-content", $el).attr("aria-hidden", "true");
		$(".popup-trigger", $el).attr("aria-expanded","true");
		$(".accessible-popup", $el).attr("aria-expanded","true");
		this.isShowed = true;
		this.adjustPosition();
	},
	hide: function(){
		var $el = $(this.el);
		var self = this;
		$el.removeClass("active");
		$(".popup-content", $el).attr("aria-hidden", "false");
		$(".popup-trigger", $el).attr("aria-expanded","false");
		$(".accessible-popup", $el).attr("aria-expanded","false");
		this.isShowed = false;
		if(this.onHide) this.onHide(this);
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
	adjustPosition: function(){
		var $el = $(this.el);
		var self = this;

		if(!this.isShowed) return;

		var contentWidth = $(".popup-content", $el).outerWidth();
		var offsetLeft = $(".popup-content", $el).parent().offset().left;
		var windowWidth = window.innerWidth;
		if(contentWidth + offsetLeft > windowWidth && !$el.hasClass("beta")) {
			$(".popup-content", $el).css("left",windowWidth - contentWidth - offsetLeft);
		} else {
			$(".popup-content", $el).css("left",'');
		}
	}
}

$.fn.popup = function(options){
	return this.each(function(){
		var popup = new Popup(this, options);
		jQuery.data(this, "popup", popup);
	});
}