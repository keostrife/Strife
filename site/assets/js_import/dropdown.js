/**
 * Custom Dropdown jquery plugin
 * ===========
 *
 * .el = the html element
 * .show() = show content
 * .hide() = hide content
 * .toggle() = show/hide content
 * .onShow (callback) = is called BEFORE showing content, return false will stop function
 * .onHide (callback) = is called BEFORE hiding content, return false will stop function
 * .onTrigger (callback) = is called BEFORE showing/hiding content, return false will stop function
 * .isShowed (BOOL) = whether the dropdown is active
 * .trigger (string) = trigger type, default to click
 *
 * requires the element to have "data-expand" attribute, the value should be the id of the .dropdown-content element 
 * When initialized using jQuery: $(select).dropdown();
 * The object will be tied to the element itself using $.data with the name of "dropdown"
 * so to retrieve the object, use $.data(el,"dropdown");
 */

function Dropdown(el, options) {
	var options = options || {};
	this.el = el;
	this.isShowed = false;
	this.expandUnit = $(el).attr("data-expand");
	this.trigger = options.trigger || "click";
	this.parent = $("#"+this.expandUnit).parent();
	//if the callback return false, it will stop script from executing
	this.onTrigger = options.onTrigger;
	this.onShow = options.onShow;
	this.onHide = options.onHide;
	this.allowClickthrough = options.allowClickthrough || false;
	this.animationDisabled = options.animationDisabled || false;
	this.text = $(this.el).html();
	var self = this;

	$(el).on(this.trigger, function(e){
		if(self.onTrigger) {
			if(self.onTrigger(self) === false) return;
		}
		self.toggle();
		if(!self.allowClickthrough) {
			e.preventDefault();
		}
	});
	
	//if this is also has tooltip, make sure it show up properly when mouse over .dropdown-content
	if($(this.el).hasClass("tooltip-trigger")) {
		$("#"+this.expandUnit).on("mouseover", function(){
			$.data($(self.el)[0],"tooltip").disable();
		});
		$("#"+this.expandUnit).on("mouseout", function(){
			$.data($(self.el)[0],"tooltip").enable();
		});
	}

	$(this.el).on("keypress", function(e){
		if(e.which == 32 || e.which == 13) {
			self.toggle();
			return false;
		}
	});

	this.init();

	$(window).resize(function(){
		if(self.isShowed) {
			$("#"+self.expandUnit).css("max-height",self.getHiddenSize("#"+self.expandUnit).height);
			var expandUnitHiddenHeight = self.getHiddenSize("#"+self.expandUnit).height;
			self.parent.css("min-height", expandUnitHiddenHeight+$(self.el).height());
		} else {
			self.parent.css("min-height", "");
			$("#"+self.expandUnit).css("max-height","");
		}
	});
}

Dropdown.prototype = {
	init: function(){
		//accessibility features
		$(this.el).attr("tabindex", "0");
		$(this.el).attr("aria-expanded", "false");
		if(!$(this.el).attr("href") && !this.allowClickthrough)
			$(this.el).attr("href", "#"+this.expandUnit);
		$(this.el).attr("aria-controls", this.expandUnit);
		if($(this.el).attr("id")) {
			labelID = $(this.el).attr("id"); 
		} else {
			labelID = this.expandUnit+"-label";
			$(this.el).attr("id", labelID);
		}
		
		$("#"+this.expandUnit).attr("aria-labelledby",labelID).attr("aria-hidden","false");

		if(this.parent.hasClass("active")) this.show(true);
	},
	toggle: function(){
		if(!this.isShowed) {
			this.show();
		} else {
			this.hide();
		}
	},
	show: function(noFocus){
		var $el = $(this.el);
		var self = this;
		var expandUnit = this.expandUnit;
		var parent = this.parent;
		if(!expandUnit || $("#"+expandUnit).length <= 0) return false;

		if(this.onShow) {
			if(this.onShow(this) === false) return;
		}
		parent.addClass("active");
		var expandUnitHiddenHeight = self.getHiddenSize("#"+expandUnit).height;
		$("#"+expandUnit)
			.attr("aria-hidden","false")
			.attr("aria-selected","true")
			.css({
				"max-height":expandUnitHiddenHeight,
				"padding-top": "",
				"padding-bottom": ""
			});
		

		//re-adjust parents' height
		var bubblingLevel = $("#"+expandUnit);
		while(bubblingLevel.parent().parent().hasClass("dropdown-content")) {
			bubblingLevel = bubblingLevel.parent().parent();
			bubblingLevel.css("max-height",self.getHiddenSize(bubblingLevel).height);
		}

		$el.attr("aria-expanded","true");
		if(!noFocus) $("#"+expandUnit).attr("tabindex","-1").focus();
		
		this.isShowed = true;
		if($(this.el).attr("data-closeText")) $(this.el).html($(self.el).attr("data-closeText"));

		//fix off screen in mobile
		var delayTime = self.animationDisabled?0:600;
		
			setTimeout(function(){
				if(self.isShowed)
					parent.css("min-height", expandUnitHiddenHeight+$el.height());
				if(parent.offset().top < $(window).scrollTop() && !noFocus)
					$("html, body").animate({
						scrollTop: parent.offset().top- 20
					});
			}, delayTime);

		return true;
	},
	hide: function(){
		var $el = $(this.el);
		var self = this;
		var expandUnit = this.expandUnit;
		var parent = this.parent;

		if(!expandUnit || $("#"+expandUnit).length <= 0) return false;
		
		if(this.onHide) {
			if(this.onHide(this) === false) return;
		}
		$("#"+expandUnit)
			.attr("aria-selected","false")
			.attr("aria-hidden","true")
			.css({
				"max-height":"",
				"padding-bottom": 0,
				"padding-top": 0
			});
		parent.css("min-height", "");
		var delayTime = self.animationDisabled?0:600;
		setTimeout(function(){
			if(!self.isShowed)
				parent.removeClass("active");
		}, delayTime);

		$el.attr("aria-expanded","false");
		this.isShowed = false;
		if($(this.el).attr("data-closeText")) $(this.el).html(self.text);

		return true;
	},
	//get width and height of hidden element
	getHiddenSize: function(el){
		var $el = $(el);
		var clone = $el.clone();
		//fix radio input bug
		$("input[type=radio]", clone).prop("checked",false);
		//calculate height for error messages as well
		$(".error", clone).css("display","block");
		clone.css({
			"-webkit-transition": "none",
			"transition": "none",
			"left": "-10000px",
			"top": "-10000px",
			"display": "block",
			"visibility": "visible",
			"opacity": "0",
			"max-height": "none",
			"min-height": 0,
			"max-width": "none",
			"min-width": 0
		});
		clone.appendTo($el.parent());
		var cloneWidth = clone.outerWidth();
		var cloneHeight = clone.outerHeight();
		clone.remove();
		return {
			width: cloneWidth,
			height: cloneHeight
		}
	}
}

$.fn.dropdown = function(options){
	return this.each(function(){
		var dropdown = new Dropdown(this, options);
		jQuery.data(this, "dropdown", dropdown);
	});
}