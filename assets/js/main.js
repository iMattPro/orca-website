/**
 * Callback functionality for jCarousel
 */
function mycarousel_initCallback(carousel, state) {
	// Since we get all URLs in one file, we simply add all items at once and set the size accordingly.
	if (state !== 'init') {
		return;
	}

	// Load all posters from an external JSON file via AJAX
	$.getJSON('assets/img/posters/poster_images.json', function(data) {
		var i, items = [];

		$.each(data, function(title, url) {
			items.push(`<img class="tipTip poster" src="assets/img/posters/${url}" title="${title}" alt="" width="94" height="140" />`);
		});

		for (i = 0; i < items.length; i++) {
			carousel.add(i + 1, items[i]);
		}

		carousel.size(items.length);
	});

	// Disable autoscrolling if the user clicks the prev or next button.
	carousel.buttonNext.on('click', function() {
		carousel.startAuto(0);
	});

	carousel.buttonPrev.on('click', function() {
		carousel.startAuto(0);
	});

	// Pause autoscrolling if the user moves with the cursor over the clip.
	carousel.clip.hover(function() {
		carousel.stopAuto();
	}, function() {
		carousel.startAuto();
	});
}

$(document).ready(function() {

	// jCarousel
	$('#credits_carousel').jcarousel({
		auto: 8,
		wrap: 'circular',
		scroll: 8,
		initCallback: mycarousel_initCallback
	});

	// contact form
	$('.contact-form').on('click', function(e) {
		e.preventDefault();
		const $form = $('#cm-frm');
		$form.removeClass('d-none');
		$('html,body').animate({scrollTop: $form.offset().top}, 'slow');
	});

	// dynamic copyright year
	$('.copyYear').append(` - ${(new Date).getFullYear()}`);
});

$(document).ajaxComplete(function() {
	$('[data-toggle="tooltip"]').tooltip();
});
