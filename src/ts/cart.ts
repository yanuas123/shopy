/* Cart module ----------------- */

/* jQuery connect ---------------- */
import * as $ from "jquery";

import {Popup, Confirm, conf_user_data_arg, conf_product_data, logged_user} from "./@types/global";
/// <reference path="@types/js-global.d.ts"/>
import {performTooltip} from "./plug-modules/tooltip";

// global ajax request
import {ajax_methods, ajax_content_type, postReqObj, getReqObj, putReqObj, delReqObj, ajax_prop, Request_} from "./plug-modules/ajax";

/* arguments interfaces */
export interface cart_product {
	_id: string;
	id: string;
	name: string;
	describe: string;
	main_photo: string;
	price: number;
	category_name: string;
	types: string;
	color: string;
	size: string;
	qty: number;
	max_qty: number;
	total_price: number;

	cart_el?: JQuery<HTMLElement>;
}

export interface elements_attr_name {
	item: string;
	main_photo: string;
	name: string;
	category_name: string;
	describe: string;
	size: string;
	total_price: string;
	del_btn: string;
	target_qty: string;
	incr_qty: string;
	decr_qty: string;
}
export interface cart_prop {
	modal: string;
	submit_id: string;
	cart_icon_wrap_id: string;
	cart_count_id: string;
	cart_icon_style_active: string;

	item_data_attr: string;
	elements_data_attr: string;
	count_attr: string;
	elements_attr_name?: elements_attr_name
}


interface cart_elements {
	modal: string;
	submit: HTMLElement;
	items_container: HTMLElement;
	cart_icon_wrap: HTMLElement;
	cart_count: HTMLElement;
	cart_icon_style_active: string;
	item_element: string;

	item_data_attr: string;
	elements_data_attr: string;
	count_attr: string;
	elements_attr_name: elements_attr_name
}

const CART_PROP: cart_prop = {
	modal: "cart",
	submit_id: "popup_cart_confirm",
	cart_icon_wrap_id: "cart_icon_wrap",
	cart_count_id: "cart_qty",
	cart_icon_style_active: "active",

	item_data_attr: "data-cart-id",
	elements_data_attr: "data-in",
	count_attr: "data-count-qty",
	elements_attr_name: {
		item: "cartitem",
		main_photo: "cartitem_image",
		name: "cartitem_name",
		category_name: "cartitem_category",
		describe: "cartitem_description",
		size: "cartitem_size",
		total_price: "cartitem_price",
		del_btn: "cartitem_delete",
		target_qty: "product_target_qty",
		incr_qty: "product_plus_qty",
		decr_qty: "product_minus_qty"
	}
};

export class Cart_ {
	prop: cart_elements;
	items: cart_product[];

	constructor(prop: cart_prop = CART_PROP) {
		if(!prop.elements_attr_name) prop.elements_attr_name = CART_PROP.elements_attr_name;
		let items_container = $(`[${prop.elements_data_attr}='${prop.elements_attr_name.item}']`).parent()[0];

		this.items = [];
		this.prop = {
			modal: prop.modal,
			submit: document.getElementById(prop.submit_id),
			items_container: items_container,
			cart_icon_wrap: document.getElementById(prop.cart_icon_wrap_id),
			cart_count: document.getElementById(prop.cart_count_id),
			cart_icon_style_active: prop.cart_icon_style_active,
			item_element: items_container.innerHTML,

			item_data_attr: prop.item_data_attr,
			elements_data_attr: prop.elements_data_attr,
			count_attr: prop.count_attr,
			elements_attr_name: prop.elements_attr_name
		};
		items_container.innerHTML = "";

		this.prop.submit.addEventListener("click", (e) => {
			e.preventDefault();
			this.submit();
		});

		this.manageCoockie(false);
		this.prop.cart_icon_wrap.addEventListener("click", (e) => {
			if(this.items && this.items.length) Popup.open(this.prop.modal);
			else performTooltip(this.prop.cart_icon_wrap, "Cart is empty");
		});
	}

	public addToCart(prod: cart_product): boolean {
		let contains = false;
		for(let i = 0; i < this.items.length; i++) {
			if(this.items[i].id == prod.id && this.items[i].color == prod.color && this.items[i].size == prod.size) contains = true;
		}
		if(contains) return false;
		else {
			this.items[this.items.length] = prod;
			this.itemCompilation(this.items[this.items.length - 1]);
			this.manageCoockie(true);
			this.manageCartIcon();
			return true;
		}
	}
	private itemCompilation(prod: cart_product): void {
		$(this.prop.items_container).append(this.prop.item_element);
		let element = $(this.prop.items_container).children(`[${this.prop.elements_data_attr}='${this.prop.elements_attr_name.item}']`).last();
		$(element).attr(this.prop.item_data_attr, prod.id);
		$(element).find(`[${this.prop.elements_data_attr}='${this.prop.elements_attr_name.main_photo}']`).attr("src", prod.main_photo);
		$(element).find(`[${this.prop.elements_data_attr}='${this.prop.elements_attr_name.name}']`).text(prod.name);
		$(element).find(`[${this.prop.elements_data_attr}='${this.prop.elements_attr_name.category_name}']`).text(prod.category_name);
		$(element).find(`[${this.prop.elements_data_attr}='${this.prop.elements_attr_name.describe}']`).text(prod.describe);
		$(element).find(`[${this.prop.elements_data_attr}='${this.prop.elements_attr_name.size}']`).text(prod.size);
		$(element).find(`[${this.prop.count_attr}='${this.prop.elements_attr_name.target_qty}']`).text(prod.qty);
		$(element).find(`[${this.prop.count_attr}='${this.prop.elements_attr_name.incr_qty}']`).click((e) => {
			e.preventDefault();
			this.count_qty(prod.id, e.target, true);
		});
		$(element).find(`[${this.prop.count_attr}='${this.prop.elements_attr_name.decr_qty}']`).click((e) => {
			e.preventDefault();
			this.count_qty(prod.id, e.target, false);
		});
		$(element).find(`[${this.prop.elements_data_attr}='${this.prop.elements_attr_name.total_price}']`).text(prod.total_price);
		$(element).find(`[${this.prop.elements_data_attr}='${this.prop.elements_attr_name.del_btn}']`).click((e) => {
			e.preventDefault();
			let item_id = prod.id;
			for(let i = 0; i < this.items.length; i++) {
				if(this.items[i].id == item_id) this.items.splice(i, 1);
			}
			$(e.target).closest(`[${this.prop.item_data_attr}='${item_id}']`).remove();
			this.manageCoockie(true);
			if(!this.items.length) Popup.close();
			this.manageCartIcon();
		});
		prod.cart_el = element;
	}
	public checkExistItem(id: string, color: string, size: string): boolean {
		let exist: boolean = false;
		for(let i = 0; i < this.items.length; i++) {
			if(this.items[i].id == id && this.items[i].color == color && this.items[i].size == size) {
				exist = true;
				break;
			}
		}
		return exist;
	}
	private manageCoockie(set: boolean): void { // set-true = set products to coockie, set-false = get products from coockie
		const TIME = 60 * 60 * 24 * 2;

		if(set) {
			docCookies.setItem("orders", JSON.stringify(this.items), TIME);
		} else {
			let coockie = docCookies.getItem("orders");
			if(coockie) {
				let coockie_arr = JSON.parse(coockie);
				if(coockie_arr instanceof Array && coockie_arr.length) {
					this.items = [];
					for(let i = 0; i < coockie_arr.length; i++) {
						let order_item = <cart_product> coockie_arr[i];
						this.items[i] = order_item;
						this.itemCompilation(this.items[i]);
					}
					this.manageCartIcon();
				}
			}
		}
	}
	private manageCartIcon(): void {
		if(this.items && this.items.length) {
			let count = this.items.length;
			this.prop.cart_count.innerHTML = count.toString();
			this.prop.cart_icon_wrap.classList.add(this.prop.cart_icon_style_active);
		} else {
			this.prop.cart_count.innerHTML = "";
			this.prop.cart_icon_wrap.classList.remove(this.prop.cart_icon_style_active);
		}
	}
	count_qty(id: string, target: HTMLElement, up: boolean): void {
		let item_id = id;
		let element = null;
		for(let i = 0; i < this.items.length; i++) {
			if(this.items[i].id == item_id) element = this.items[i];
		}
		let qty: number;
		if(up) {
			if(element.qty === element.max_qty) {
				performTooltip(target, "No more quantity in the shop");
				return;
			}
			else qty = ++element.qty;
		}
		else {
			if(element.qty === 1) {
				performTooltip(target, "It is minimum quantity");
				return;
			}
			else qty = --element.qty;
		}
		element.total_price = qty * element.price;
		$(element.cart_el).find(`[${this.prop.count_attr}='${this.prop.elements_attr_name.target_qty}']`).text(qty);
		$(element.cart_el).find(`[${this.prop.elements_data_attr}='${this.prop.elements_attr_name.total_price}']`).text(element.total_price);
		this.manageCoockie(true);
	}
	submit(): void {
		if(this.items && this.items.length) {
			let product_data: conf_product_data[] = [];
			for(let i = 0; i < this.items.length; i++) {
				let product = {
					product_id: this.items[i]._id,
					name: this.items[i].name,
					prod_type: this.items[i].types,
					price: this.items[i].price,
					size: this.items[i].size,
					color: this.items[i].color,
					qty: this.items[i].qty,
					total_price: this.items[i].total_price
				};
				product_data.push(product);
			}
			let user_data = <conf_user_data_arg> logged_user || undefined;
			let callback = () => {
				this.items = [];
				this.manageCoockie(true);
				this.manageCartIcon();
			};
			Confirm.open(product_data, callback, user_data);
		} else {
			performTooltip(this.prop.submit, "Cart is empty!");
			setTimeout(() => {
				Popup.close(this.prop.modal);
			}, 3000);
		}
	}
}