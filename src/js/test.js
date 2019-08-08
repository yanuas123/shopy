/* launch Slick sliders ---------------- */
$("#home_slider").slick({
	arrows: false,
	appendDots: ".slider-indicator-block",
	dots: true,
	dotsClass: "slider-indicator-block-wrap",
	zIndex: 60
});
$("#product_gallery").slick({
	autoplay: true,
	arrows: false,
	dots: false,
	infinite: false,
	slidesToScroll: 1,
	zIndex: 30,
	asNavFor: "#product_gallery_nav",
	lazyLoad: "progressive"
});
$("#product_gallery_nav").slick({
	autoplay: true,
	arrows: false,
	dots: false,
	infinite: false,
	asNavFor: "#product_gallery",
	slidesToShow: 3,
	slidesToScroll: 1,
	zIndex: 30,
	focusOnSelect: true
});