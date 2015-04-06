/**
	HTML Sample:
	<figure class="video" data-video="<?=BASE?>/assets/videos/test" data-poster="<?=BASE?>/assets/images/videoThumb.jpg" data-title="Test video"></figure>

  */
App.video = {
	init: function(){
		$("figure.video").each(function(){
			var $this = $(this);
			var videoSrc = $this.attr("data-video");
			var posterSrc = $this.attr("data-poster");
			var title = $this.attr("data-title");
			if(App.isMobile()) $this.replaceWith(App.video.generateVideoTemplate(videoSrc, posterSrc, title));
			else $this.replaceWith(App.video.generateModalTemplate(videoSrc, posterSrc, title));
		});
		$("a.playVideo").on("click", function(e){
			var $this = $(this);
			var videoSrc = $this.attr("data-video");
			var posterSrc = $this.attr("data-poster");
			var title = $this.attr("data-title");
			var modal = $this.attr("href");
			$(modal).find("#myModalLabel").html(title);
			$(modal).find(".modal-body").html(App.video.generateVideoTemplate(videoSrc, posterSrc, title));
			$(".modal").modal("hide");
			$(modal).modal("show");
			$(modal).find("video").focus();
		});
	},
	generateVideoTemplate: function(video, poster, title){
		return '\
			<video controls poster="'+poster+'">\
				<source src="'+video+'.mp4" type="video/mp4">\
				<source src="'+video+'.ogv" type="video/ogg">\
				Your browser does not support the video tag.\
			</video>';
	},
	generateModalTemplate: function(video, poster, title){
		return '\
		<a href="#myModal" class="playVideo" data-video="'+video+'" data-poster="'+poster+'" data-title="'+title+'">\
		    <img src="'+poster+'" alt="Play video">\
		    <span class="playBtn">\
		    	<span class="glyphicon glyphicon-play"></span>\
		    </span>\
		</a>';
	}
}