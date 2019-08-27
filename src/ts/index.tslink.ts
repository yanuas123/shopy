/* IMPORTMODULES ------------------------------------------------------------ */

/* jQuery connect ---------------- */
import * as $ from "jquery";
/* Slick connect ----------------- */
/// <reference path="@types/slick/index.d.ts"/>
/// <reference path="@types/js-global.d.ts"/>

// @tslink:inject plug-modules/index.tslink.ts
import {getAttrVal} from "./plug-modules/DOM_services";

import {performTooltip} from "./plug-modules/tooltip";

import {CopyTextToBuffer} from "./plug-modules/tobuffer-copy";

import {loadMore} from "./plug-modules/load-more";

import {PopupProp, PopupTrigger} from "./plug-modules/popup";

import {LocPopup} from "./plug-modules/local-popup";

import {RangeProp, RangeValues, RangeErrMsg, rangeDQS, RangeFilter} from "./plug-modules/range-filter";

import {TemplateTypes, SubmitEl, InpArg, FormArg, formData, validationServerCall, formCallFunc, validationCallFunc, ValidationProp, Validation} from "./plug-modules/validation";

import {ajax_methods, ajax_content_type, postReqObj, getReqObj, putReqObj, delReqObj, ajax_prop, Request_} from "./plug-modules/ajax";

import {addSelectCountries, select_form_data} from "./plug-modules/select-countries";


/* working parts imports */

// @tslink:inject mainmenu.ts
import {compileMainMenu} from "./mainmenu";
// @tslink:inject footermenu.ts
import {compileFooterMenu} from "./footermenu";
// @tslink:inject confirmation.ts
import {setConfirmation, conf_user_data_arg, conf_product_data, confirm_prop} from "./confirmation";
// @tslink:inject cart.ts
import {Cart_, cart_product, elements_attr_name, cart_prop} from "./cart";
// @tslink:inject search.ts
import {Search_, search_arg_prop, search_arg_attr_names} from "./search";
// @tslink:inject categories.ts
import {Categories_, ctgr_arg_prop_names, ctgr_getter_fc, ctgr_arg_prop} from "./categories";
// @tslink:inject products.ts
import {pr_prop, attr_names_big_item, attr_names_little_item, attr_names_single_item, Products_} from "./products";

/* launch validation ------------------- */
let validation = new Validation();

/* launch popup functionality ---------- */
let Popup = new PopupTrigger();
Popup.launchModule();

/* download categories data */
let categories: categories_ = {};
let ctgr_callback = (data: any) => {
	for(let i = 0; i < data.length; i++) {
		categories[data[i].name] = data[i];
	}
}
Request_._get({
	action: "/categories",
	callbacks: {
		success: ctgr_callback
	},
	responsType: "json"
});

let LocalPopup = new LocPopup("local_popup_parent");
LocalPopup.setPopup("logout_popup");
let Confirm = new setConfirmation();
let Cart = new Cart_();
let ctgr_selector_el = document.getElementById("product_selector");
let Product_selecotr: Categories_;
if(ctgr_selector_el) Product_selecotr = new Categories_("product_selector");

/* end IMPORT MODULES ------------------------------------------------------- */
/* ========================================================================== */

/* add countries to select elements ------------ */
addSelectCountries([{
	form_name: "sign_in",
	select_name: "country"
}, {
	form_name: "confirmation",
	select_name: "country_name"
}]);

/* copy contacts to buffer ------------- */
CopyTextToBuffer("[data-in='contact_email_info']", ".contact_text", "The email address was copied");
CopyTextToBuffer("[data-in='contact_tel_info']", ".contact_text", "The phone number was copied");

/* launch Slick sliders ---------------- */
function homeSlider(): void {
	$("#home_slider").slick({
		arrows: false,
		appendDots: ".slider-indicator-block",
		dots: true,
		dotsClass: "slider-indicator-block-wrap",
		zIndex: 60
	});
}
homeSlider();
function productSlider(): void {
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
};

/* validation Properties ---------------------------------------------------- */


// subscribe form
const form_subscription: HTMLFormElement = document.querySelector("form[name='subscription']");
if(form_subscription) validation.setForm({
	element: form_subscription,
	submit_el: "submit"
}, (form: HTMLFormElement, data: formData, call: formCallFunc) => {
		let callback = (data: any) => {
			let info_block = document.getElementById("info_popup_text");
			info_block.innerHTML = "Thank you for subscription!";
			Popup.open("information");
			call(true);
		}
		let prop: putReqObj = {
			action: "/mailing",
			data: data,
			callbacks: {
				success: callback
			}
		};
		Request_._put(prop);
	});
// message form
const form_message: HTMLFormElement = document.querySelector("form[name='message']");
if(form_message) validation.setForm({
	element: form_message,
	submit_el: "submit"
}, (form: HTMLFormElement, data: formData, call: formCallFunc) => {
		let info_block = document.getElementById("info_popup_text");
		info_block.innerHTML = "Thank you for message!";
		Popup.open("information");
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

						if(select_ukrpost_value == "add_new_address") {
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
						if(value == "add_new_address") {
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
	return true;
};


// Forgot password form
const form_forgot_password: HTMLFormElement = document.querySelector("form[name='forgot_password']");
if(form_forgot_password) validation.setForm({
	element: form_forgot_password,
	submit_el: "submit"
}, (form: HTMLFormElement, data: formData, call: formCallFunc) => {
	let callback = (data: any) => {
		if(data && data! instanceof Array) {
			let info_block = document.getElementById("info_popup_text");
			info_block.innerHTML = "Message has been sent to your email. Please follow the link in this message to change your password.";
			Popup.open("information");
		} else if(data instanceof Array) {
			call(<string[]> data);
		}
	}
	let prop: postReqObj = {
		action: "/mailing",
		data: data,
		callbacks: {
			success: callback
		},
		responsType: "json"
	};
	Request_._put(prop);
});

// login form
const form_login: HTMLFormElement = document.querySelector("form[name='log_in']");
if(form_login) validation.setForm({
	element: form_login,
	submit_el: "submit"
}, (form: HTMLFormElement, data: formData, call: formCallFunc) => {
	let valid = validation.validateForm(form_login);
	if(valid) {
		let callback = (data: any) => {
			location.reload();
			call(true);
		};
		let prop = {
			action: "/login",
			data: data,
			callbacks: {
				success: callback,
				error: (data: any) => {
					call(["password"]);
				}
			}
		};
		Request_._post(prop);
	}
});
$("#login_submit").click((e) => {
	let valid = validation.validateForm(form_login);
	if(valid) return true;
	else return false;
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
	let callback = (data: any) => {
		let info_block = document.getElementById("info_popup_text");
		info_block.innerHTML = "Thank you for registration!<br>Message has been sent to your email. Please follow the link in this message to confirm email address.";
		Popup.open("information");
		}

		interface user_data {
			email: string;
			phone?: string;
			first_name?: string;
			last_name?: string;
			address?: {
				country_name: string;
				city: string;
				post_code: string;
				street: string;
				house_number: string;
			}
		}
		let user_data: user_data = {
			email: <string> data.email
		};
		if(data.tel) user_data.phone = <string> data.tel;
		if(data.shipping_info == "yes") {
			user_data.first_name = <string> data.first_name;
			user_data.last_name = <string> data.last_name;
			user_data.address = {
				country_name: <string> data.country,
				city: <string> data.city,
				post_code: <string> data.post_code,
				street: <string> data.street,
				house_number: <string> data.house_number
			};
		}

	let prop: postReqObj = {
		action: "/user",
		data: user_data,
		callbacks: {
			success: callback
		},
		responsType: "json"
	};
	Request_._put(prop);
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


/* Start execution ---------------------------------------------------------- */


function setPage(): string {
	let page_name = null;
	if(document.getElementById("home_page")) page_name = "home";
	else if(document.getElementById("contact_page")) page_name = "contact";
	else if(document.getElementById("products_page")) page_name = "products";
	return page_name;
}
const PAGE_NAME = setPage();

setTimeout(() => {
	$("a[href='#']").on("click", (e: Event) => {
		e.preventDefault();
	});
}, 3000);

function startCommonData() {
	// Main Menu
	let main_menu_block = document.getElementById("main_menu_list");
	if(main_menu_block) {
		let callback = (data: any) => {
			compileMainMenu(main_menu_block, data, PAGE_NAME);
		}
		let prop: getReqObj = {
			action: "/mainmenu",
			callbacks: {
				success: callback
			},
			responsType: "json"
		};
		Request_._get(prop);
	}
	// Footer Menu
	let footer_menu_block = document.getElementById("footer_menu");
	if(footer_menu_block) {
		let callback = (data: any) => {
			compileFooterMenu(footer_menu_block, data);
		}
		let prop: getReqObj = {
			action: "/footermenu",
			callbacks: {
				success: callback
			},
			responsType: "json"
		};
		Request_._get(prop);
	}
	// Phone, Email info
	let email_info = $("[data-in='contact_email_info']");
	let tel_info = $("[data-in='contact_tel_info']");
	if(email_info || tel_info) {
		let callback = (data: any) => {
			if(email_info) $(email_info).find(".contact_text").text(data.email);
			if(tel_info) $(tel_info).find(".contact_text").text(data.phone);
		};
		let prop: getReqObj = {
			action: "/contacts",
			callbacks: {
				success: callback
			},
			responsType: "json"
		};
		Request_._get(prop);
	}
	// Socnetworks
	const ATTR_NAME = "data-in";
	let facebook = $("[" + ATTR_NAME + "='social_facebook']");
	let twitter = $("[" + ATTR_NAME + "='social_twitter']");
	let google = $("[" + ATTR_NAME + "='social_google']");
	let instagram = $("[" + ATTR_NAME + "='social_instagram']");
	if(facebook.length || twitter.length || google.length || instagram.length) {
		let callback = (data: any) => {
			if(facebook.length) {
				let exist_fb = false;
				let exist_tw = false;
				let exist_gl = false;
				let exist_in = false;
				for(let i = 0; i < data.length; i++) {
					let target = null;
					if(data[i].name.toLowerCase() == "facebook") {
						target = facebook;
						exist_fb = true;
					}
					if(data[i].name.toLowerCase() == "twitter") {
						target = twitter;
						exist_tw = true;
					}
					if(data[i].name.toLowerCase() == "google") {
						target = google;
						exist_gl = true;
					}
					if(data[i].name.toLowerCase() == "instagram") {
						target = instagram;
						exist_in = true;
					}
					$(target).attr("href", data[i].link).on("click", (e) => {
						e.preventDefault();
						window.open(data[i].link, "", "toolbar=0,status=0,scrollbars=1,width=626,height=436");
					});
					if(data[i].class_name) $(target).addClass(data[i].class_name);
				}
				if(!exist_fb) $(facebook).addClass("hidden");
				if(!exist_tw) $(twitter).addClass("hidden");
				if(!exist_gl) $(google).addClass("hidden");
				if(!exist_in) $(instagram).addClass("hidden");
			}
		};
		let prop: getReqObj = {
			action: "/socnetworks",
			callbacks: {
				success: callback
			},
			responsType: "json"
		};
		Request_._get(prop);
	}
}
startCommonData();

/* authorization */
let logged_user: any = null;
let user_icon = document.getElementById("user_auth_mark");

function authGetUser(): void {
	let callback = (data: any, status: number) => {
		if(status == 200) {
			logged_user = data;
			user_icon.classList.add("active");
			$("[data-in='product_like']").removeClass("disabled");
			user_icon.addEventListener("click", (e) => {
				LocalPopup.openWithMouse("logout_popup", <MouseEvent> e);

			});
		} else {
			$("[data-in='product_like']").addClass("disabled");
			user_icon.addEventListener("click", (e) => {
				Popup.open("login");
			});
		}
	};
	let prop: getReqObj = {
		action: "/getuser",
		callbacks: {
			success: callback,
			error: () => {
				$("[data-in='product_like']").addClass("disabled");
				user_icon.addEventListener("click", (e) => {
					Popup.open("login");
				});
			}
		},
		responsType: "json"
	};
	Request_._get(prop);
}
authGetUser();


function logoutUser(): void {
	let callback = (data: any, status: number) => {
		location.reload();
	};
	let prop: getReqObj = {
		action: "/logout",
		callbacks: {
			success: callback
		}
	};
	Request_._get(prop);
}
let logout = document.getElementById("logout_btn");
if(logout) {
	logout.addEventListener("click", () => {
		logoutUser();
	});
}



let contacts = document.getElementById("contact_info_address");
if(contacts) {
	let callback = (data: any, status: number) => {
		let contact_str = "";
		if(data.country_name) contact_str += data.country_name + ", ";
		if(data.city) contact_str += data.city + ", ";
		if(data.street) contact_str += data.street + " ";
		if(data.house_number) contact_str += data.house_number;
		$(contacts).text(contact_str);
	};
	let prop: getReqObj = {
		action: "/contacts",
		callbacks: {
			success: callback
		},
		responsType: "json"
	};
	Request_._get(prop);
}

/* search functional */
let search_form = $("form[name='search_form']")[0];
if(search_form) new Search_();

/* products info functional */
let new_arrivals_prop: pr_prop = {
	block_selector: "[data-in='section_newarrivals']",
	container_attr_name: "prod_items_block",
	block_type: "big item",
	loadmore_btn_id: "load_new_arrivals",
	loadmore_block_attr_name: "load_more_block",
	page_step: 4,
	request_action: "/newarrivals"
};
if($("[data-in='section_newarrivals']").length) new Products_(new_arrivals_prop);

let best_sales_prop: pr_prop = {
	block_selector: "[data-in='section_bestsales']",
	container_attr_name: "prod_items_block",
	block_type: "little item",
	request_action: "/bestsales",
	max_item: 3
};
if($("[data-in='section_bestsales']").length) new Products_(best_sales_prop);

let prod_url = window.location.search.replace("?url=", "");

let related_prod_prop: pr_prop = {
	block_selector: "[data-in='section_relatedproducts']",
	container_attr_name: "prod_items_block",
	block_type: "big item",
	max_item: 4
};
let prod_page_prop: pr_prop = {
	block_selector: "[data-in='section_productdescribe']",
	block_type: "single item",
	request_action: "/products?link=" + prod_url
};
if($("[data-in='section_productdescribe']").length && prod_url) new Products_(prod_page_prop, related_prod_prop);

let products_page_prop: pr_prop = {
	block_selector: "[data-in='section_productlist']",
	container_attr_name: "prod_items_block",
	block_type: "big item",
	loadmore_btn_id: "load_products_page",
	loadmore_block_attr_name: "load_more_block",
	page_step: 9,
	request_action: "/products",
	categories: true
};
if($("[data-in='section_productlist']").length) new Products_(products_page_prop);

/* end Start execution ------------------------------------------------------ */