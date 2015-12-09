/**
 * Custom Search field suggestion jquery plugin
 * ===========
 *
 * .el = the html element
 * .data = array of data to be rendered, THIS SHOULD BE UPDATED BEFORE THE CONTENT IS DISPLAYED USING .beforeShow(object) callback
	data_structure = [
		{
			title: "This will be displayed as a suggestion",
			link: "if this field is empty, it will not be a link",
			target: "_self or _blank"
		}
	]
 * .isShowed (BOOL) = if the suggestion box is displayed or not
 * .beforeShow (object, callback) = function to call before the suggestion is displayed, this should be used to update the object.data
 	@object: the searchbox object
 	@callback: you have to call this at the end after you updated object.data. The reason for this inconvinience is that sometimes you will use ajax to fetch the data and javascript currently doesn't support Promises or any kind of sort. this callback is to display the suggestions box.
	Sample:
	searchboxObject.beforeShow(function(object, showSuggestions){
		object.data = [
			{
				title: "option1",
				link: ""
			},
			....
		]
		showSuggestions();
	});
 * .enableSubmitBtn() = enable submit button
 * .disableSubmitBtn() = disable submit button
 * .showSuggestions() = show the box, you should not have to call this, it's built in
 * .hideSuggestions() = hide the suggestion box
 *
 * all element with .searchbox class is initialized already
 * When initialized using jQuery: $(select).searchbox();
 * The object will be tied to the element itself using $.data with the name of "searchbox"
 * so to retrieve the object, use $.data(el,"searchbox");
 */

function Searchbox(el, options) {
	var options = options || {};
	this.el = el;
	this.isShowed = false;
	this.beforeShow = options.beforeShow || null;
	var self = this;
	this.data = [];
	this.currentKeyword = $("input[type=text]", this.el).val();

	/* Example of .beforeShow() */
	this.beforeShow = function(object, showSuggestions){
		object.data = [
			{
				title: "page1",
				link: "",
				target: "_blank"
			},
			{
				title: "page12",
				link: "http://google.ca"
			},
			{
				title: "page1dfgad",
				link: "http://google.ca"
			},
			{
				title: "padiooods dlidfjllfdj",
				link: "http://google.ca"
			}
		];
		showSuggestions();
	}

	

	$("input[type=text]", this.el).on("keyup",function(e){
		if (this.value) {
			self.enableSubmitBtn();
			if(this.value != self.currentKeyword) {
				self.currentKeyword = this.value;
				self.showSuggestions();
			}
		} else {
			self.disableSubmitBtn();
			self.hideSuggestions();
		}

		if(e.which == 40 && this.value) {
			if(!self.isShowed) {
				self.showSuggestions();
			} else {
				$(".suggestions-container ul li:first-child a", self.el).focus();
				this.value = $(".suggestions-container ul li:first-child a", self.el).html();
				return false;
			}
		}

		if(e.which == 27) {
			self.hideSuggestions();
		}
	});

	$("input[type=text]", this.el).on("keydown", function(e){
		if(e.which == 9) {
			self.hideSuggestions();
		}
	});

	$(".suggestions-container", this.el).on("keydown", function(e){
		var current = $(".suggestions-container ul li a:focus", el);
		if(!current) {
			$(".suggestions-container ul li:first-child a", el).focus();
			$("input[type=text]", el).val($(".suggestions-container ul li:first-child a", el).html());
			return false;
		}
		if(e.which == 40) {
			if(current[0] == $(".suggestions-container ul li:last-child a", el)[0]) {
				$("input[type=text]", el).val(self.currentKeyword);
				$("input[type=text]", el).focus();
				return false;
			}
			var nextItem = current.parent().next().find("a");
			nextItem.focus();
			$("input[type=text]", el).val(nextItem.html());
		} else if (e.which == 38) {
			if(current[0] == $(".suggestions-container ul li:first-child a", el)[0]) {
				$("input[type=text]", el).val(self.currentKeyword);
				$("input[type=text]", el).focus();
				return false;
			}
			var prevItem = current.parent().prev().find("a");
			prevItem.focus();
			$("input[type=text]", el).val(prevItem.html());
		} else if (e.which == 27) {
			self.hideSuggestions();
			$("input[type=text]", el).val(self.currentKeyword);
			$("input[type=text]", el).focus();
		}
	});

	$(".suggestions-container", this.el).focusout(function(){
		//since focusout fire before the next element is focused, we cheat a little bit, since focus should fire immediately, 100ms should be safe
		//what u gonna do about it *thug life*
		setTimeout(function(){
			if($(".suggestions-container ul li a:focus", self.el).length < 1 && !$("input[type=text]", self.el).is(":focus")) {
				self.hideSuggestions();
				$("input[type=text]", self.el).val(self.currentKeyword);
			}
		},100);

	});

	$(this.el).on("click",function(e){
		e.stopPropagation();
	});

	$("body").on("click",function(){
		self.hideSuggestions();
	});

	this.init();
}

Searchbox.prototype = {
	init: function(){
		$(this.el).attr("role","search");
		if(!$("input[type=text]", this.el).val())
			this.disableSubmitBtn();
		else
			this.enableSubmitBtn();
	},
	enableSubmitBtn: function(){
		$("input[type=submit]", this.el).prop('disabled', false);
		$("input[type=submit]", this.el).attr("aria-disabled", "false");
	},
	disableSubmitBtn: function(){
		$("input[type=submit]", this.el).prop('disabled', true);
		$("input[type=submit]", this.el).attr("aria-disabled", "true");
	},
	showSuggestions: function(){
		var windowWidth = window.innerWidth;
		if(windowWidth < CCO.breakpoint) return false;
		var self = this;
		if(this.beforeShow) this.beforeShow(this, function(){
			if(!self.data || self.data.length < 1) return false;
			self.renderSuggestions(self.data);
			$(".suggestions-container", self.el).show();
			$("p[role=status] span.resultCount", self.el).html(self.data.length);
			self.isShowed = true;
		});
	},
	hideSuggestions: function(){
		$(".suggestions-container", this.el).hide();	
		this.isShowed = false;
		//this.currentKeyword = $("input[type=text]", this.el).val();
	},
	renderSuggestions: function(data){
		var self=this;
		var html = "";
		html+="<ul>";
		for(var i = 0, iLen = data.length; i<iLen; i++) {
			var record = data[i];
			var target = record.target || "_blank";
			if(!record.link)
				html+="<li role='presentation'><a href=''>"+record.title+"</a></li>";
			else
				html+="<li role='presentation'><a href='"+record.link+"' target='"+target+"'>"+record.title+"</a></li>";
			
		}
		html+="</ul>";
		$(".suggestions-container",this.el).html(html);
		
		$(".suggestions-container li a", this.el).on("click", function(e){
			if(!$(this).attr("href")) {
				self.currentKeyword=$(this).text();
				$("input[type=text]", self.el).val(self.currentKeyword).focus();
				self.hideSuggestions();
				return false;
			}
		});
	}
}

$.fn.searchbox = function(options){
	return this.each(function(){
		var searchbox = new Searchbox(this, options);
		jQuery.data(this, "searchbox", searchbox);
	});
}