/* Confirmatio module */

/* jQuery connect ---------------- */
import * as $ from "jquery";

import {validation, label_form_confirmation, Popup} from "./@types/global";

// global ajax request
import {ajax_methods, ajax_content_type, postReqObj, getReqObj, putReqObj, delReqObj, ajax_prop, Request_} from "./plug-modules/ajax";

/* confirmation properties */
export interface conf_user_data_arg {
	_id: string;
	email: string;
	phone?: string;
	first_name?: string;
	last_name?: string;
	new_post_inf?: {
		newpost_city: string;
		newpost_department: string;
	},
	address?: {
		country_name: string;
		city: string;
		post_code: string;
		street: string;
		house_number: string;
	}
}
export interface conf_product_data {
	product_id: string;
	name: string;
	prod_type: string;
	price: number;
	size: string;
	color: string;
	qty: number;
	total_price: number;
}

export interface confirm_prop {
	popup_selector: string;
	form_name: string;
	payment_id: string;
	submit_id: string;
	phone_blobk_id: string;
	price_id: string;
}


/* class interfaces */
interface form_elements {
	popup_selector: string;
	form_name: string;
	payment_el: HTMLElement;
	submit_el: HTMLElement;
	phone_block: HTMLElement;
	price_el: HTMLElement;
}

const CONFIRM_DEF_PROP: confirm_prop = {
	popup_selector: "confirm_registered",
	form_name: "confirmation",
	payment_id: "confirm_payment_btn",
	submit_id: "confirm_confirm_btn",
	phone_blobk_id: "popup_confirm_phone_block",
	price_id: "popup_confirm_price"
};

interface user_data {
	related_user?: string;
	phone: string;
	first_name: string;
	last_name: string;
	new_post_inf?: {
		newpost_city: string;
		newpost_department: string;
	};
	address?: {
		country_name: string;
		city: string;
		post_code: string;
		street: string;
		house_number: string;
	};
}


export class setConfirmation {
	form_data: form_elements;
	product_data?: {
		total_price: number;
		total_qty: number;
		items: conf_product_data[];
	}
	shipping_method: string;
	payment_method: string;
	user_data?: user_data;

	callback?: Function;

	constructor(prop: confirm_prop = CONFIRM_DEF_PROP) {
		this.form_data = {
			popup_selector: prop.popup_selector,
			form_name: prop.form_name,
			payment_el: document.getElementById(prop.payment_id),
			submit_el: document.getElementById(prop.submit_id),
			phone_block: document.getElementById(prop.phone_blobk_id),
			price_el: document.getElementById(prop.price_id)
		};
	}

	public open(products: conf_product_data[], callback: Function, user?: conf_user_data_arg): void {
		let total_qty = 0;
		let total_price = 0;

		for(let i = 0; i < products.length; i++) {
			total_qty++;
			total_price += products[i].total_price;
		}
		this.product_data = {
			total_price: total_price,
			total_qty: total_qty,
			items: products
		};
		this.form_data.price_el.innerHTML = total_price.toString();
		this.callback = callback;
		if(label_form_confirmation !== true && label_form_confirmation instanceof Function) label_form_confirmation();
		Popup.open(this.form_data.popup_selector);

		if(user) {
			this.user_data = {
				related_user: user._id,
				phone: user.phone,
				first_name: user.first_name,
				last_name: user.last_name,
				new_post_inf: user.new_post_inf,
				address: user.address
			};
		} else this.user_data = {
			phone: undefined,
			first_name: undefined,
			last_name: undefined
		};
		this.setUserData();

		this.form_data.submit_el.addEventListener("click", (e) => {
			e.preventDefault();
			this.submit();
		});

		this.form_data.payment_el.addEventListener("click", (e) => {
			e.preventDefault();
			this.payment();
		});
	}
	public submit(): void {
		let valid = validation.validateForm(this.form_data.form_name);
		let data = null;
		if(valid) {
			data = validation.getData(this.form_data.form_name);
			this.getUserData(data);

			this.shipping_method = <string> data.shipping_method;
			this.payment_method = <string> data.payment_method;

			let data_obj = {
				total_price: this.product_data.total_price,
				total_qty: this.product_data.total_qty,
				product_data: this.product_data.items,
				shipping_method: this.shipping_method,
				user_data: {
					related_user: this.user_data.related_user,
					phone: this.user_data.phone,
					first_name: this.user_data.first_name,
					last_name: this.user_data.last_name,
					new_post_inf: this.user_data.new_post_inf,
					address: this.user_data.address
				},
				payment_method: this.payment_method
			};

			let callback = (data: any) => {
				let info_block = document.getElementById("info_popup_text");
				info_block.innerHTML = "Thank You for Your order!";
				Popup.open("information");
				validation.resetForm(this.form_data.form_name);
				this.callback();
			}
			let prop: putReqObj = {
				action: "/orders",
				data: data_obj,
				callbacks: {
					success: callback
				}
			};
			Request_._put(prop);
		}
	}
	private payment(): void {
		let valid = validation.validateForm(this.form_data.form_name);
		if(valid) {
			if(true) this.submit();
		}
	}
	private getUserData(data: {[item: string]: string | number}): void {
		if(!this.user_data.phone) this.user_data.phone = <string> data.empty_phone;

		if(data.shipping_method == "New Post") {
			this.user_data.first_name = <string> data.newpost_first_name;
			this.user_data.last_name = <string> data.newpost_last_name;
			this.user_data.new_post_inf = {
				newpost_city: <string> data.newpost_city,
				newpost_department: <string> data.newpost_department
			};
			this.user_data.address = undefined;
		} else if(data.shipping_method == "Ukrpost") {
			if(data.ukrpost_address == "add_new_address") {
				this.user_data.first_name = <string> data.first_name;
				this.user_data.last_name = <string> data.last_name;
				this.user_data.address = {
					country_name: <string> data.country_name,
					city: <string> data.city,
					post_code: <string> data.post_code,
					street: <string> data.street,
					house_number: <string> data.house_number
				};
			} else {
				this.user_data.new_post_inf = undefined;
			}
		}
	}
	private setUserData(): void {
		if(this.user_data) {
			if(this.user_data.phone) {
				this.form_data.phone_block.classList.add("hidden");
				validation.changeHidden(this.form_data.form_name, this.form_data.phone_block, true);
			} else {
				this.form_data.phone_block.classList.remove("hidden");
				validation.changeHidden(this.form_data.form_name, this.form_data.phone_block, false);
			}
			if(this.user_data.new_post_inf) {
				$(`form[name='${this.form_data.form_name}']`).find("[name='newpost_city']").val(this.user_data.new_post_inf.newpost_city);
				$(`form[name='${this.form_data.form_name}']`).find("[name='newpost_department']").val(this.user_data.new_post_inf.newpost_department);
			} else {
				$(`form[name='${this.form_data.form_name}']`).find("[name='newpost_city']").val("");
				$(`form[name='${this.form_data.form_name}']`).find("[name='newpost_department']").val("");
			}
			if(this.user_data.first_name) $(`form[name='${this.form_data.form_name}']`).find("[name='newpost_first_name']").val(this.user_data.first_name);
			else $(`form[name='${this.form_data.form_name}']`).find("[name='newpost_first_name']").val("");
			if(this.user_data.last_name) $(`form[name='${this.form_data.form_name}']`).find("[name='newpost_last_name']").val(this.user_data.last_name);
			else $(`form[name='${this.form_data.form_name}']`).find("[name='newpost_last_name']").val("");

			if(this.user_data.address) {
				$("<option>").val("old_address").text("old address").prop("selected", true).prependTo(`form[name='${this.form_data.form_name}'] select[name='ukrpost_address']`);
			} else {
				$(`form[name='${this.form_data.form_name}'] select[name='ukrpost_address']`).find("option[value='old_address']").remove();
				$(`form[name='${this.form_data.form_name}'] select[name='ukrpost_address']`).find("option[value='add_new_address']").prop("selected", true);
			}
		} else {
			$(`form[name='${this.form_data.form_name}']`).find("[name='newpost_city']").val("");
			$(`form[name='${this.form_data.form_name}']`).find("[name='newpost_department']").val("");
			$(`form[name='${this.form_data.form_name}']`).find("[name='newpost_first_name']").val("");
			$(`form[name='${this.form_data.form_name}']`).find("[name='newpost_last_name']").val("");

			$(`form[name='${this.form_data.form_name}'] select[name='ukrpost_address']`).find("option[value='old_address']").remove();
			$(`form[name='${this.form_data.form_name}'] select[name='ukrpost_address']`).find("option[value='add_new_address']").prop("selected", true);
		}
	}
}