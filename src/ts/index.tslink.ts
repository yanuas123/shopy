/* IMPORTMODULES ------------------------------------------------------------ */

/* jQuery connect ---------------- */
import * as $ from "jquery";
/* Slick connect ----------------- */
/// <reference path="@types/slick/index.d.ts"/>

// @tslink:inject DOM_services.ts
import {getAttrVal} from "./DOM_services";
// @tslink:inject event-tasker.ts

// @tslink:inject tooltip.ts
import {performTooltip} from "./tooltip";
// @tslink:inject tobuffer-copy.ts
import {CopyTextToBuffer} from "./tobuffer-copy";
// @tslink:inject load-more.ts
import {loadMore} from "./load-more";
// @tslink:inject popup.ts
import {PopupProp, PopupTrigger} from "./popup";
// @tslink:inject range-filter.ts
import {RangeProp, RangeValues, RangeErrMsg, rangeDQS, RangeFilter} from "./range-filter";
// @tslink:inject validation.ts
import {TemplateTypes, SubmitEl, validationServerCall, formCallFunc, formData, validationCallFunc, InpArg, FormArg, ValidationProp, Validation} from "./validation";

/* end IMPORT MODULES ------------------------------------------------------- */
/* ========================================================================== */

/* copy contacts to buffer ------------- */
CopyTextToBuffer("contact_email_info", ".contact_text", "The email address was copied");
CopyTextToBuffer("contact_tel_info", ".contact_text", "The phone number was copied");

/* set range filter -------------------- */
let range_container: HTMLElement = document.getElementById("selector_price_range");
if(range_container) new RangeFilter("selector_price_range").launchModule();

/* launch popup functionality ---------- */
let Popup = new PopupTrigger();
Popup.launchModule();

/* launch Slick sliders ---------------- */
$(() => {
	$("#home_slider").slick({
		arrows: false,
		appendDots: ".slider-indicator-block",
		dots: true,
		dotsClass: "slider-indicator-block-wrap",
		zIndex: 60
	});
	let gallery_slick = $("#product_gallery").slick({
		autoplay: true,
		arrows: false,
		dots: false,
		infinite: false,
		slidesToScroll: 1,
		zIndex: 30,
		asNavFor: "#product_gallery_nav",
		lazyLoad: "progressive"
	});
	let gallery_nav_slick = $("#product_gallery_nav").slick({
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
	let distance: number;
	$("[data-product-gallery-item]").on("mousedown", (e) => {
		let slide = e.currentTarget;
		distance = e.clientX;
		$(slide).one("mouseup", (e) => {
			distance = e.clientX - distance;
			if(Math.abs(distance) < 10) {
				let popup_wrap = document.querySelector(".popup-custom");
				popup_wrap.innerHTML = "";
				let src = $(slide).find("img").attr("src");
				let img_el = document.createElement("img");
				img_el.src = src;
				img_el.classList.add("product-popup-image");
				popup_wrap.appendChild(img_el);
				$(gallery_slick).slick("slickPause");
				Popup.open("custom", () => {
					$(gallery_slick).slick("slickPlay");
				});
			}
		});
	});
});

/* validation Properties ---------------------------------------------------- */

let validation = new Validation();

// subscribe form
const form_subscription: HTMLFormElement = document.querySelector("form[name='subscription']");
if(form_subscription) validation.setForm({
	element: form_subscription,
	submit_el: "submit"
}, (form: HTMLFormElement, data: formData, call: formCallFunc) => {
	console.dir(data);
		call(true);
	});
// message form
const form_message: HTMLFormElement = document.querySelector("form[name='message']");
if(form_message) validation.setForm({
	element: form_message,
	submit_el: "submit"
}, (form: HTMLFormElement, data: formData, call: formCallFunc) => {
	console.dir(data);
		call(true);
	});
// confirmation form
let label_form_confirmation: true | Function = function() {
	const form_confirmation: HTMLFormElement = document.querySelector("form[name='confirmation']");
	if(form_confirmation) validation.setForm({
		element: form_confirmation,
		items: {
			"shipping_method": {
				callback: function() {
					let value = this.value;
					let new_post_block = $("#popup_confirm_newpost_block")[0];
					let select_ukrpost = $("#popup_confirm_ukrpost_address")[0];
					let select_ukrpost_value = $(select_ukrpost).find("select").val();
					let ukrpost_block = $("#popup_confirm_ukrpost_newaddress")[0];

					if(value == "New Post") {
						$(select_ukrpost).addClass("hidden");
						$(ukrpost_block).addClass("hidden");
						$(new_post_block).removeClass("hidden");

						validation.changeHidden(form_confirmation, select_ukrpost, true);
						validation.changeHidden(form_confirmation, ukrpost_block, true);
						validation.changeHidden(form_confirmation, new_post_block, false);
					} else if(value == "Ukrpost") {
						$(new_post_block).addClass("hidden");
						$(select_ukrpost).removeClass("hidden");
						validation.changeHidden(form_confirmation, new_post_block, true);
						validation.changeHidden(form_confirmation, select_ukrpost, false);

						if(select_ukrpost_value == "add new address") {
							$(ukrpost_block).removeClass("hidden");
							validation.changeHidden(form_confirmation, ukrpost_block, false);
						} else {
							$(ukrpost_block).addClass("hidden");
							validation.changeHidden(form_confirmation, ukrpost_block, true);
						}
					}
				}
			},
			"ukrpost_address": {
				callback: function() {
					let value = this.value;
					let disabled = this.disabled;
					let ukrpost_block = $("#popup_confirm_ukrpost_newaddress")[0];

					if(!disabled) {
						if(value == "add new address") {
							$(ukrpost_block).removeClass("hidden");
							validation.changeHidden(form_confirmation, ukrpost_block, false);
						} else {
							$(ukrpost_block).addClass("hidden");
							validation.changeHidden(form_confirmation, ukrpost_block, true);
						}
					}
				}
			},
			"payment_method": {
				callback: function() {
					let value = this.value;

					if(value == "Visa/MasterCard") {
						$("#popup_confirm_paymentbtn").removeClass("hidden");
						$("#popup_confirm_submit").addClass("hidden");
					} else if(value == "after receiving") {
						$("#popup_confirm_paymentbtn").addClass("hidden");
						$("#popup_confirm_submit").removeClass("hidden");
					}
				}
			}
		}
	});
	$("#popup_confirm_paymentbtn").click((e) => {
		e.preventDefault();
		let bool = validation.validateForm(form_confirmation);
		if(bool) {
			let data = validation.getData(form_confirmation);
			console.dir(data);
			validation.resetForm(form_confirmation);
		}
	});
	$("#popup_confirm_submit").click((e) => {
		e.preventDefault();
		let bool = validation.validateForm(form_confirmation);
		if(bool) {
			let data = validation.getData(form_confirmation);
			console.dir(data);
			validation.resetForm(form_confirmation);
		}
	});
	return true;
};

// Forgot password form
let label_form_forgot_password: true | Function = function() {
	const form_forgot_password: HTMLFormElement = document.querySelector("form[name='forgot_password']");
	if(form_forgot_password) validation.setForm({
		element: form_forgot_password,
		submit_el: "submit"
	}, (form: HTMLFormElement, data: formData, call: formCallFunc) => {
		console.dir(data);
		call(true);
	});
	return true;
};

// login form
const form_login: HTMLFormElement = document.querySelector("form[name='log_in']");
if(form_login) validation.setForm({
	element: form_login,
	submit_el: "submit"
}, (form: HTMLFormElement, data: formData, call: formCallFunc) => {
	console.dir(data);
	call(true);
	});

// new_password form
let label_form_new_password: true | Function = function() {
	const form_new_password: HTMLFormElement = document.querySelector("form[name='new_password']");
	if(form_new_password) validation.setForm({
		element: form_new_password,
		submit_el: "submit",
		items: {
			"rep_password": {
				callback: function() {
					let value = this.value;
					let previous_pass = this.form_el.items["password"].value;
					if(value != previous_pass) {
						this.valid_state = false;
						this.wrap_element.classList.add(this.main_el.prop.inv_valid_class);
					}
				}
			}
		}
	}, (form: HTMLFormElement, data: formData, call: formCallFunc) => {
		console.dir(data);
		call(true);
	});
	return true;
};

// search_form form
const form_search_form: HTMLFormElement = document.querySelector("form[name='search_form']");
if(form_search_form) validation.setForm({
	element: form_search_form
});

// sign_in form
const form_sign_in: HTMLFormElement = document.querySelector("form[name='sign_in']");
if(form_sign_in) validation.setForm({
	element: form_sign_in,
	submit_el: "submit",
	items: {
		"rep_password": {
			callback: function() {
				let value = this.value;
				let previous_pass = this.form_el.items["password"].value;
				if(value != previous_pass) {
					this.valid_state = false;
					this.wrap_element.classList.add(this.main_el.prop.inv_valid_class);
				}
				console.dir(this.form_el);
			}
		}
	}
}, (form: HTMLFormElement, data: formData, call: formCallFunc) => {
	console.dir(data);
	call(true);
	});
$("#check_shipping_info").change((e) => {
	let el = $("#signin_shipping_info")[0];
	if((<HTMLInputElement> e.currentTarget).checked) {
		$(el).removeClass("hidden");
		validation.changeHidden(form_sign_in, el, false);
	} else {
		$(el).addClass("hidden");
		validation.changeHidden(form_sign_in, el, true);
	}
});

/* end Validation Properties ------------------------------------------------ */