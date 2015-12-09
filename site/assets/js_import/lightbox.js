/**
 * Custom Lightbox jquery plugin
 * ===========
 *
 * .el = the html element
 * .show() = show content
 * .hide() = hide content
 * .isShowed (BOOL) = whether the lightbox is active
 *
 * requires the element to have "data-lightbox" attribute, the value should be the id of the .lightbox element 
 * When initialized using jQuery: $(select).lightbox();
 * The object will be tied to the element itself using $.data with the name of "lightbox"
 * so to retrieve the object, use $.data(el,"lightbox");
 */

function Lightbox(el, options){
	var options = options || {};
	this.el = el;
	this.isShowed = false;
	this.lastFocusedEl = null;
	var self = this;

	$(".lightbox-trigger").on("click", function(e){
		if(CCO.layout=="desktop") {
			e.preventDefault();
			var target = $(this).attr("data-lightbox");
			$.data($("#"+target)[0],"lightbox").show();
			$.data($("#"+target)[0],"lightbox").lastFocusedEl = this;
		}
	});

	$(".close",this.el).on("click", function(){
		self.hide();
		return false;
	});

	$(".lightbox-overlay").on("click", function(){
		self.hide();
		return false;
	});

	//exit on esc
	$(this.el).on("keyup", function(e){
		if(e.which == 27) {
			self.hide();
			e.stopPropagation();
		}
	});

	//trap the focus within modal
	//stolen from jquery
	$(this.el).on("keydown", function(event){
		if(event.which !== 9) return;
		var tabbables = $(':tabbable', this),
            first = tabbables.filter(':first'),
            last  = tabbables.filter(':last');

        if (event.target === last[0] && !event.shiftKey) {
            first.focus(1);
            return false;
        } else if (event.target === first[0] && event.shiftKey) {
            last.focus(1);
            return false;
        }
	});
	
	this.init();
}

Lightbox.prototype = {
	init: function(){
		if($(".lightbox-overlay").length < 1)
			$("body").append("<div class='lightbox-overlay'></div>");
		$(this.el).attr("role","dialog");
		$(this.el).on("touchmove",function(e){
			e.stopPropagation();			
		});
	},
	show: function(){
		$(".lightbox-overlay").show();
		$(this.el).show();
		$(".wrapper").attr("aria-hidden","true");
		$("html").css({
			"height": "100%",
			"overflow": "hidden"
		}).on("touchmove.pageScroll", this.disableDefault);
		$(this.el).attr("tabindex", "-1").focus();
		this.isShowed = true;
	},
	hide: function(){
		$(this.el).hide();
		$(".lightbox-overlay").hide();
		$(".wrapper").attr("aria-hidden","false");
		$("html").css({
			"height": "",
			"overflow": ""
		}).off(".pageScroll");
		if(this.lastFocusedEl) $(this.lastFocusedEl).focus();
		this.isShowed = false;
	},
	disableDefault: function(e){
		e.preventDefault();
	}
}

$.fn.lightbox = function(options){
	return this.each(function(){
		var lightbox = new Lightbox(this, options);
		jQuery.data(this, "lightbox", lightbox);
	});
}