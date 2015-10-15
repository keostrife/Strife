function Carousel(el, options) {
	var self = this;
	this.options = options = options || {};
	this.htmlEl = el;
	this.slideCount = $(".itemContainer .slide",el).length;
	this.currentIndex = options.startIndex || 0;
	this.maxWidth = options.maxWidth || 1024;
	this.autoPlayDuration = options.autoPlayDuration || 5; //s
	this.setActiveClass();
	this.enableRotate = true;
	this.timer = null;
	this.isPaused = options.isPaused || false;

	this.viewportWidth = $(".itemContainer .slide.active", el).width();

	this.preloadImgs(function(){
		self.init();
	});
	
	

	$(".leftArrow", el).click(function(){
		self.prev();
		//reset timer
		if(self.timer)
			self.play();
		return false;
	});

	$(".viewport",el).touchwipe({
	    wipeLeft: function() { self.next(); },
	    wipeRight: function() { self.prev(); },
	    min_move_x: 20,
	    min_move_y: 20,
	    preventDefaultEvents: false
	});

	$(".rightArrow", el).click(function(){
		self.next();
		//reset timer
		if(self.timer)
			self.play();
		return false;
	});

	$(".indicators .indicator", el).click(function(){
		var index = $(".indicators .indicator").index(this);
		self.gotoSlide(index);
		//reset timer
		if(self.timer)
			self.play();
		return false;
	});

	$(".indicators .pauseBtn", el).click(function(){
		self.stop();
		return false;
	});

	$(".indicators .playBtn", el).click(function(){
		self.play();
		return false;
	});

	$(el).on("keyup", function(event){
		var keycode = event.keyCode || event.which;
		if(keycode == 37) {
			self.prev();
		} else if (keycode == 39) {
			self.next();
		}
	});

	$(window).resize(function(){
		//throttle the event with 600ms delay
		if(self.timeout) clearTimeout(self.timeout);
		self.timeout = setTimeout(function(){
			var windowWidth = $(self.htmlEl).width();
			if(windowWidth <= self.maxWidth) {
				self.setWidth(windowWidth);
			} else {
				self.setWidth(self.maxWidth);
			}
		}, 200);
	});
	

	$(".viewport", el).on("mouseover", function(){
		self.pause();
	});
	$(".viewport", el).on("mouseout", function(){
		self.unpause();
	});
}

Carousel.prototype = {
	init: function() {
		var el = this.htmlEl;
		var viewportWidth = this.viewportWidth;
		var viewportHeight;
		var currentIndex = this.currentIndex;
		var slideCount = this.slideCount;
		var self = this;

		//set viewport width and height
		$(".viewport", el).width(viewportWidth);


		//position slides
		$(".itemContainer .slide", el).each(function(index, item){
			$item = $(item);
			$item.css({
				"position": "absolute",
				"top": 0,
				"left": viewportWidth*index,
				"width": viewportWidth
			});
		});

		$(".itemContainer .decoration:first-child", el).css({
			"margin-left": 0-viewportWidth,
			"width": viewportWidth
		});

		$(".itemContainer .decoration:last-child", el).css({
			"left": viewportWidth*(slideCount+1) - 1,
			"width": viewportWidth
		});

		//set width on item container
		$(".viewport .itemContainer", el).css({
			"width": viewportWidth*slideCount,
			"left": 0-viewportWidth*currentIndex
		});



		viewportHeight = $(".itemContainer .slide.active", el).height();
		$(".viewport, .blackPlaceholder", el).height(viewportHeight);

		this.gotoSlide(this.currentIndex, true);

		if(localStorage.getItem("isStopped"))
			this.stop();
		else
			this.play();
		
	},
	preloadImgs: function(callback) {
		var el = this.htmlEl;
		$("img", el).each(function(index, img){
			var maImg = new Image();
			maImg.src = this.src;
			if(index == $("img", el).length-1) {
				//finalImage has been loaded
				maImg.onload = function(){
					callback();
				}
			}
		});
	},
	play: function(){
		var self = this;
		clearInterval(this.timer);
		this.timer = null;
		this.timer = setInterval(function(){
			if(!self.isPaused)
				self.next(true);
		}, this.autoPlayDuration*1000);
		this.showHidePlayBtn();
		localStorage.removeItem("isStopped");
	},
	stop: function(){
		clearInterval(this.timer);
		this.timer = null;
		this.showHidePlayBtn();
		localStorage.setItem("isStopped", 1);
	},
	pause: function(){
		this.isPaused = true;
	},
	unpause: function(){
		this.isPaused = false;
	},
	showHidePlayBtn: function() {
		var el = this.htmlEl;
		if(!this.timer) {
			$(".indicators .playBtn", el).addClass("active");
			$(".indicators .pauseBtn", el).removeClass("active");
		} else {
			$(".indicators .playBtn", el).removeClass("active");
			$(".indicators .pauseBtn", el).addClass("active");
		}
	},
	setWidth: function(width) {
		var el = this.htmlEl;
		this.viewportWidth = width;
		this.init();
	},
	gotoSlide: function(index, noFocus){
		var el = this.htmlEl;
		var self = this;
		var viewportWidth = this.viewportWidth;
		this.currentIndex = index;
		this.setActiveClass();
		this.setTabindex();
		$(".viewport .itemContainer", el).stop().animate({
			"left": 0 - viewportWidth*index
		}, 800, function(){
			if(!noFocus)
				$(".itemContainer .slide.active").attr("tabindex", "-1").focus();
		});
		if(!this.enableRotate)
			if(index == this.slideCount-1)
				$(".rightArrow", el).hide();
			else if (index == 0)
				$(".leftArrow", el).hide();
			else
				$(".leftArrow, .rightArrow", el).show();
		else
			$(".leftArrow, .rightArrow", el).show();
	},
	setActiveClass: function(){
		var el = this.htmlEl;
		$(".itemContainer .slide", el).removeClass("active");
		$(".itemContainer .slide:nth-of-type("+(this.currentIndex+1)+")", el).addClass("active");
		$(".indicators .indicator", el).removeClass("active");
		$(".indicators .indicator:nth-of-type("+(this.currentIndex+1)+")", el).addClass("active");
	},
	setTabindex: function(){
		var el = this.htmlEl;
		$(".itemContainer .slide a", el).attr("tabindex","-1");
		$(".itemContainer .slide:nth-of-type("+(this.currentIndex+1)+") a", el).attr("tabindex","0");
	},
	next: function(noFocus){
		var nextIndex;
		if(this.currentIndex == this.slideCount-1)
			if(this.enableRotate)
				nextIndex = 0;
			else
				return;
		else
			nextIndex = this.currentIndex+1;
		this.gotoSlide(nextIndex, noFocus);
	},
	prev: function(noFocus){
		var prevIndex;
		if(this.currentIndex == 0)
			if(this.enableRotate)
				prevIndex = this.slideCount-1;
			else
				return;
		else
			prevIndex = this.currentIndex-1;
		this.gotoSlide(prevIndex, noFocus);
	}
}

$.fn.carousel = function(options){
	return this.each(function(){
		var carousel = new Carousel(this, options);
		jQuery.data(this, "carousel", carousel);
	});
}