/**
 * Custom Tooltip jquery plugin
 * ===========
 *
 * .el = the html element
 * .show() = show content
 * .hide() = hide content
 * .toggle() = show/hide content
 * .disable() = disable
 * .enable() = enable
 * .isShowed (BOOL) = whether the tooltip is active
 * .trigger (string) = trigger type, default to click, can be hover
 *
 * requires the element to have "data-tooltip" attribute, the value should be the id of the .tooltip-content element
 * When initialized using jQuery: $(select).tooltip();
 * The object will be tied to the element itself using $.data with the name of "tooltip"
 * so to retrieve the object, use $.data(el,"tooltip");
 */

function Tooltip(el, options) {
	var options = options || {};
	this.el = el;
	this.isShowed = false;
	this.expandUnit = $(this.el).attr("data-tooltip");
	this.trigger = options.trigger || "hover";
	this.disableMobile = options.disableMobile || true;
	this.delay = options.delay || 0;
	this.timeout = null;
	this.isDisabled = false;
	var self = this;

	if(CCO.isMobile() && !this.disableMobile) this.trigger = "click";
	// this.trigger="click";
	if(this.trigger == "click") {
		$(this.el).on("click",function(e){
			if(self.isDisabled) return false; 
			self.toggle();
			return false;
		})
	} else if (this.trigger == "hover") {
		$(this.el).attr("aria-describedby",this.expandUnit);
		$(this.el).parent().on("mouseenter", function(){
			if(self.isDisabled) return; 
			if(CCO.isMobile()) return;
			if(!self.delay)
				self.show();
			else if(!this.isShowed)
				self.timeout = setTimeout(function(){
					self.show();
				},self.delay*1000);
		});

		$(this.el).on("focus", function(){
			if(self.isDisabled) return; 
			if(CCO.isMobile()) return;
			//if tooltip is advanced and has accessible buttons, don't open on focus
			if($(".accessible-tooltip",$(self.el).parent()).length > 0) return;
			self.show();
		});

		$(this.el).parent().on("mouseleave", function(){
			clearTimeout(self.timeout);
			self.timeout = null;
			self.hide();
		});

		$(this.el).on("blur", function(){
			clearTimeout(self.timeout);
			self.timeout = null;
			self.hide();
		});
	}
	$("#"+this.expandUnit).on("click", function(e){
		e.stopPropagation();
	});
	$("#"+this.expandUnit).on("keyup", function(e){
		if(e.which == 27) {
			self.hide();
			$(self.el).focus();
		}
	});
	$(".close","#"+this.expandUnit).on("click", function(){
		self.hide();
		$(self.el).focus();
		return false;
	});
	$(".accessible-tooltip",$(this.el).parent()).on("click", function(){
		if(self.isDisabled) return false; 
		self.toggle();
		return false;
	});
	this.init();

	$(window).resize(function(){
		self.adjustSide();
	});
}

Tooltip.prototype = {
	init: function(){
		this.hide();
		$(this.el).attr("href", "#"+this.expandUnit);
		$(this.el).attr("tabindex", 0);
		$("#"+this.expandUnit).removeClass("active");
		$("#"+this.expandUnit).attr("role","tooltip");
		$("#"+this.expandUnit).attr("aria-hidden","true");
	},
	toggle: function(){
		var windowWidth = window.innerWidth;
		if(windowWidth < CCO.breakpoint) return;
		if(!this.isShowed) {
			this.show();
			$("#"+this.expandUnit).attr("tabindex","-1").focus();
		} else {
			this.hide();
			$(this.el).focus();
		}
	},
	show: function(){
		var windowWidth = window.innerWidth;
		if(windowWidth < CCO.breakpoint) return;
		$("#"+this.expandUnit).addClass("active");
		$("#"+this.expandUnit).attr("aria-hidden","false");
		$(".accessible-tooltip",$(this.el).parent()).removeClass("visible");
		$(".accessible-tooltip.close",$(this.el).parent()).addClass("visible");
		this.isShowed = true;
		this.adjustSide();
		
	},
	hide: function(){
		$("#"+this.expandUnit).removeClass("active");
		$("#"+this.expandUnit).attr("aria-hidden","true");
		$(".accessible-tooltip",$(this.el).parent()).addClass("visible");
		$(".accessible-tooltip.close",$(this.el).parent()).removeClass("visible");
		this.isShowed = false;
	},
	disable: function(){
		this.hide();
		$(".accessible-tooltip",$(this.el).parent()).prop("disabled", true);
		this.isDisabled = true;
	},
	enable: function(){
		$(".accessible-tooltip",$(this.el).parent()).prop("disabled", false);
		this.isDisabled = false;
	},
	//check if there is enough space on the right, add ".left" class otherwise
	adjustSide: function(){
		if(this.isShowed && CCO.layout=="desktop") {
			$("#"+this.expandUnit).removeClass("left");
			if($("#"+this.expandUnit).offset().left + $("#"+this.expandUnit).width() > window.innerWidth && !$("#"+this.expandUnit).hasClass("left")) {
				$("#"+this.expandUnit).addClass("left");
			} else if ($("#"+this.expandUnit).offset().left + $("#"+this.expandUnit).width() < window.innerWidth && $("#"+this.expandUnit).hasClass("left")) {
				$("#"+this.expandUnit).removeClass("left");
			}
		}
	}
}

$.fn.tooltip = function(options){
	return this.each(function(){
		var tooltip = new Tooltip(this, options);
		jQuery.data(this, "tooltip", tooltip);
	});
}