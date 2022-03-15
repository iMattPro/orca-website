(function($) {
	$(function() {
		// Initialize jCarousel
		var jcarousel = $(".jcarousel").jcarousel({
			wrap: "circular"
		});

		// Initialize jCarousel Nav Buttons
		$(".jcarousel-prev")
			.on("jcarouselcontrol:active", function() {
				$(this).removeClass("inactive");
			})
			.on("jcarouselcontrol:inactive", function() {
				$(this).addClass("inactive");
			})
			.jcarouselControl({
				target: "-=8"
			});

		$(".jcarousel-next")
			.on("jcarouselcontrol:active", function() {
				$(this).removeClass("inactive");
			})
			.on("jcarouselcontrol:inactive", function() {
				$(this).addClass("inactive");
			})
			.jcarouselControl({
				target: "+=8"
			});

		// Setup the carousel poster data
		var setup = function(data) {

			var html = "<ul>";

			$.each(data, function(title, url) {
				html += "<li><img src=\"assets/posters/" + url + "\" class=\"border border-secondary\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"" + title + "\" alt=\"\" width=\"94\" height=\"140\" /></li>";
			});

			html += "</ul>";

			// Append items
			jcarousel.html(html);

			// Reload carousel
			jcarousel.jcarousel("reload").jcarouselAutoscroll({
				interval: 8000,
				target: "+=8",
				autostart: true
			});

		};

		// AJAX load poster JSON data
		$.getJSON("assets/posters/poster_images.json", setup);

		// Pause autoscrolling if the user moves with the cursor over the clip.
		jcarousel.on("mouseenter", function() {
			jcarousel.jcarouselAutoscroll("stop");
		}).on("mouseleave", function() {
			jcarousel.jcarouselAutoscroll("start");
		});

		// contact form
		$(".contact-form").on("click", function(e) {
			e.preventDefault();
			var $form = $("#cm-frm");
			$form.removeClass("d-none");
			$("html,body").animate({scrollTop: $form.offset().top}, "slow");
		});

		// dynamic copyright year
		$(".copyYear").append(" - " + (new Date).getFullYear());
	});

	$(document).ajaxComplete(function() {
		$("[data-toggle=\"tooltip\"]").tooltip();
	});
})(jQuery);
