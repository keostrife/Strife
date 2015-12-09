/**
 * Custom Modal jquery plugin
 * ===========
 *
 * .el = the html element
 * .show() = show content
 * .hide() = hide content
 * .backgroundContainer = selector for the wrapper, the wrapper will get hidden while the modal is active
 * .isShowed (BOOL) = whether the modal is active
 *
 * requires the element which trigger this modal to have "data-expand" attribute and ".modal-trigger" class, the value should be the id of the .modal element 
 * When initialized using jQuery: $(select).mobileModal();
 * The object will be tied to the element itself using $.data with the name of "mobileModal"
 * so to retrieve the object, use $.data(el,"mobileModal");
 */

function MobileModal(el, options) {
	var options = options || {};
	this.el = el;
	this.isShowed = false;
	this.backgroundContainer = options.backgroundContainer || ".wrapper";
	this.animationDuration = options.animationDuration || 600;
	this.currentPageScrolltop = 0;
	var self = this;
	//show hide mobile nav
	$(".close", el).on("click",function(){
		self.hide();
		return false;
	});

	$(".modal-trigger").on("click touchend", function(e){
		if(CCO.layout == "mobile"){
			e.preventDefault();
			var target = $(this).attr("data-modal");
			$.data($("#"+target)[0],"mobileModal").show();
		}
	});

	$(el).on("click touchend", function(e){
		e.stopPropagation();
	});

	$(window).resize(function(){
		if(CCO.layout == "desktop") {
			CCO.nav.hideAllMobile();
			self.hide();
			CCO.nav.adjustNavPriority();
		}
	});

	this.init();
}

MobileModal.prototype = {
	init: function(){
		$(self.backgroundContainer).attr("aria-hidden","false");
		$(this.el).attr("role","dialog");
		this.currentPageScrolltop = $(window).scrollTop();
	},
	show: function(){
		var self = this;
		this.currentPageScrolltop = $(window).scrollTop();
		$(this.el).css("visibility","visible");
		$(this.el).addClass("active");
		$(this.el).css("position","fixed");
		setTimeout(function(){
			$(self.el).css("position","");
			if($(self.el).hasClass("active")) {
				$(self.backgroundContainer).addClass("noscroll");
				$(self.backgroundContainer).attr("aria-hidden","true");
			}
		}, this.animationDuration);
		this.isShowed = true;
	},
	hide: function(){
		if(this.isShowed) {
			var self = this;
			$(this.el).css("position","fixed");
			$(this.el).removeClass("active");
			$(this.backgroundContainer).removeClass("noscroll");
			$(this.backgroundContainer).attr("aria-hidden","false");
			$(window).scrollTop(this.currentPageScrolltop);
			setTimeout(function(){
				$(self.el).css("position","");
				$("ul.topLevel", self.el).removeClass("exclude-mode");
				$(self.el).css("visibility","hidden");
				CCO.nav.hideAllMobile();
			}, this.animationDuration);
			this.isShowed = false;
		}
	}
}

$.fn.mobileModal = function(options){
	return this.each(function(index, el){
		var mobileModal = new MobileModal(this, options);
		jQuery.data(this, "mobileModal", mobileModal);
	});
}