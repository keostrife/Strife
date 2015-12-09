/**
 * Custom Accordion jquery plugin
 * ===========
 *
 * .el = the html element
 * .toogleAll() = expand/collapse all dropdown within the accordion
 * .switchToTab() = convert to tab
 * .switchToAccordion() = convert to accordion
 *
 * When initialized using jQuery: $(select).accordion();
 * The object will be tied to the element itself using $.data with the name of "accordion"
 * so to retrieve the object, use $.data(el,"accordion");
 */

function Accordion(el, options) {
	var options = options || {};
	this.el = el;
	var self = this;

	this.init();

	//Toggle all accordion items button event
	$(".toggleAll",el).on("click", function(){
		self.toggleAll();
		self.fixPagescroll();
		return false;
	});

	//change state of toggle button
	$(".dropdown-trigger", el).each(function(){
		var self = this;
		var dropdown = $.data(this,"dropdown");
		dropdown.onShow = function(object){
			
			var allExpanded = true;
			$(".dropdown-trigger", el).each(function(){
				if(self == this) return true;
				//if multiselectable functionality
				if($(el).attr("multiselectable") === "false") {
					$.data(this,"dropdown").hide();
				}
				if(!$.data(this,"dropdown").isShowed) {
					allExpanded = false;
				}
			});

			if(allExpanded) $(".toggleAll",el).html($(".toggleAll",el).attr("data-closeText"));
			else $(".toggleAll",el).html($(".toggleAll",el).attr("data-openText"));

		}

		dropdown.onHide = function(){
			$(".toggleAll",el).html($(".toggleAll",el).attr("data-openText"));
		}
	});

	//accessibility
	$(".dropdown-trigger, .toggleAll, .dropdown-content", el).on("keydown", function(e){
		//arrow right and down
		if(e.which == 40 || e.which == 39) {
			if(e.target == $(".dropdown-trigger", el).last()[0]) $(".toggleAll",el).focus();
			else if (e.target == $(".toggleAll", el)[0]) $(".dropdown-trigger", el).first().focus();
			else $(".dropdown-trigger",$(this).parent().next()).focus();
			return false;
		//arrow left and up
		} else if (e.which == 37 || e.which == 38) {
			if(e.target == $(".dropdown-trigger", el).first()[0]) $(".toggleAll",el).focus();
			else if (e.target == $(".toggleAll", el)[0]) $(".dropdown-trigger", el).last().focus();
			else $(".dropdown-trigger",$(this).parent().prev()).focus();
			return false;
		//home
		} else if (e.which == 36) {
			$(".dropdown-trigger", el).first().focus();
			return false;
		} else if (e.which == 35) {
			$(".dropdown-trigger", el).last().focus();
			return false;
		}
	});

	
	this.switchMode();
	$(window).resize(function(){
		self.switchMode();
	});

	
}

Accordion.prototype = {
	init: function(){
		var el = this.el;
		//cache current button label
		$(".toggleAll",el).attr("data-openText", $(".toggleAll",el).html());
		$(el).attr("role","tablist");
		$(".dropdown-trigger",el).attr("role","tab");
		$(el).attr("data-multiselectable", $(el).attr("multiselectable"));
	},
	toggleAll: function(){
		var allExpanded = true;
		$(".dropdown-trigger", this.el).each(function(){
			if(!$.data(this,"dropdown").isShowed) {
				allExpanded = false;
				return false;
			}
		});

		$(".dropdown-trigger", this.el).each(function(){
			if(!allExpanded) {
				$.data(this,"dropdown").show(true);
			} else {
				$.data(this,"dropdown").hide();
			}
		});
	},
	switchMode: function(){
		var el = this.el;
		//flexible tab and accordion
		if($(el).hasClass("flexible")) {
			$(el).addClass("tab");
			$(el).attr("multiselectable", "false");
			var parentWidth = $(el).width(),
				totalWidth = 0;
			$(".tab-item",el).each(function(){
				totalWidth+=$(this).outerWidth();
			});
			if(totalWidth < parentWidth) this.switchToTab();
			else this.switchToAccordion();
		}
	},
	switchToTab: function(){
		var el = this.el;
		$(el).addClass("tab");
		$(el).attr("multiselectable", "false");
		$(".dropdown-trigger", el).each(function(){
			var dropdown = $.data(this,"dropdown")
			dropdown.animationDisabled = true;
			dropdown.onTrigger = function(object){
				if(object.isShowed) return false;
			}

			if($(el).attr("data-multiselectable") == "true" && 
				$(".tab-item.active",el).length > 1) {
				if(this == $(".dropdown-trigger", el).first()[0]) dropdown.show();
				else dropdown.hide();
			}
		});
	},
	switchToAccordion: function(){
		var el = this.el;
		$(el).removeClass("tab");
		var multiselectable = $(el).attr("data-multiselectable") || "true";
		$(el).attr("multiselectable", multiselectable);
		$(".dropdown-trigger", el).each(function(){
			var dropdown = $.data(this,"dropdown")
			dropdown.animationDisabled = false;
			dropdown.onTrigger = null;
		});
	},
	fixPagescroll: function(){
		var self = this;
		$("html, body").animate({
			scrollTop: $(self.el).offset().top - 20
		},600);
	}
}

$.fn.accordion = function(options){
	return this.each(function(){
		var accordion = new Accordion(this, options);
		jQuery.data(this, "accordion", accordion);
	});
}