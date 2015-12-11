/**
 * generic functionality of the site
 */
App.generic = {
	init: function(){
		this.heightSync(); //make all elements in the same container have the same height
		this.maxHeight(); //make the element have 100% of parent
		this.stickToTop(); //make .stickToTop stick to the top of the page
		this.stickToBottom();
	
	
		//back to top button
		$(".backtotop a").on("click", function(){
			App.generic.backtotop();
			return false;
		});

		$(".smoothScroll").on("click", function(e){
			var target = $(this).attr("href");
			var $target = $(target);
			var tombstoneHeight = $(".tombstone").outerHeight();
			var topOffset = $target.offset().top;
			if($target.length > 0) {
				$("html, body").animate({
					scrollTop: topOffset-20
				}, 600, function(){
					$target.attr("tabindex","-1").focus();
				});
				return false;
			}
		});

		//skip to main content button
		$("#skipToMainContent").on("click",function(){
			$("#mainContent").attr("tabindex","-1").focus();
		});

		$(window).scroll(function(){
			App.generic.stickToTop();	
			App.generic.stickToBottom();
		});

		$(window).resize(function(){
			$(".stickToTop").attr("data-height","").removeClass("sticked");
			$(".stickToBottom").attr("data-height","").removeClass("sticked");
			App.generic.stickToTop();
			App.generic.stickToBottom();
			App.generic.heightSync();	
			App.generic.maxHeight();
		});
	},
	heightSync: function(){
		$(".heightSync").each(function(){
			var maxHeight = 0;
			var self = this;
			$("li",this).each(function(index, el){
				$(el).css("height", "");
				if($(el).height() > maxHeight) maxHeight = $(el).height();
			})
			$("li",this).height(maxHeight);
		});
	},
	maxHeight: function(){
		$(".full-height").each(function(){
			var $parent = $(this).parent();
				
			var self = this;
			//preload images first
			App.preloadImgsOf($parent, function(){
				$(self).height($parent.height());
			});
		});
	},
	
	backtotop: function(){
		var top = 0;
		if($("h1").length > 0) {
			top = $("h1").first().offset().top;
		}
		$("html, body").animate({
			scrollTop: top
		}, 600, function(){
			$("h1").first().attr("tabindex","-1").focus();
		});
	},
	stickToTop: function(){
		$(".stickToTop").each(function(){
			var $this = $(this);
			var $nextEl = $this.next();
			/*
			do {
				$nextEl = $nextEl.next();
			}
			while ($nextEl.hasClass("tombstone"));
			*/
			if(!$this.attr("data-height"))
				$this.attr("data-height",$this.offset().top);

			//some basic validation
			if($("html").height() - $(this).outerHeight() < window.innerHeight) return;

			if($(window).scrollTop() > $this.attr("data-height")) {
				$this.addClass("sticked");
				$nextEl.css("margin-top",$this.outerHeight())
			} else {
				$this.removeClass("sticked");
				$nextEl.css("margin-top","");
			}
		});
	},
	stickToBottom: function(){
		$(".stickToBottom").each(function(){
			var $this = $(this);
			if(CCO.layout == "mobile") {
				$this.removeClass("sticked");
				return true;
			}
			if(!$this.attr("data-height"))
				$this.attr("data-height", $this.offset().top+$this.height());

			//some basic validation
			if($("html").height() - $(this).outerHeight() < window.innerHeight) return;

			if($(window).scrollTop() + window.innerHeight > $this.attr("data-height") && CCO.layout == "desktop") {
				$this.removeClass("sticked");
			} else {
				$this.addClass("sticked");
			}
		});
	}
}