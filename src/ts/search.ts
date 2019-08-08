/* Search module ----------------------- */

/* jQuery connect ---------------- */
import * as $ from "jquery";

import {categories, validation} from "./@types/global";

// global ajax request
import {ajax_methods, ajax_content_type, postReqObj, getReqObj, putReqObj, delReqObj, ajax_prop, Request_} from "./plug-modules/ajax";

/* module properties */
export interface search_arg_attr_names {
	item: string;
	image: string;
	name: string;
	category: string;
	description: string;
}
export interface search_arg_prop {
	form_name: string;
	submit_id: string;
	no_result_id: string;
	result_container_id: string;
	loader_id: string;
	request_action: string;
	prod_directory_url: string;
	ctgr_select: string;
	brand_select: string;
	selection_start: string;
	selection_end: string;

	hidden_class: string;
	res_data_attr: string;
	res_data_attr_names?: search_arg_attr_names;
}

const MODULE_PROP: search_arg_prop = {
	form_name: "search_form",
	submit_id: "popup_search_submit",
	no_result_id: "popup_search_notfound",
	result_container_id: "popup_search_resultlist",
	loader_id: "popup_search_load",
	request_action: "/searchproducts",
	prod_directory_url: "/products?url=",
	ctgr_select: "search_categories",
	brand_select: "search_brand",
	selection_start: "<span class='text-highlighted'>",
	selection_end: "</span>",


	hidden_class: "hidden",
	res_data_attr: "data-in",
	res_data_attr_names: {
		item: "searchitem",
		image: "searchitem_image",
		name: "searchitem_name",
		category: "searchitem_category",
		description: "searchitem_description"
	}
};

interface module_prop {
	form_name: string;
	submit_el: HTMLElement;
	no_result_el: HTMLElement;
	result_container_el: HTMLElement;
	loader_el: HTMLElement;
	request_action: string;
	prod_directory_url: string;
	ctgr_select: HTMLElement;
	brand_select: HTMLElement;
	item_html: string;
	selection_start: string;
	selection_end: string;

	hidden_class: string;
	res_data_attr: string;
	res_data_attr_names: search_arg_attr_names;
}
interface search_prop {
	name: string;
	category?: string;
	brand?: string;
	check_description?: boolean;
}


/* main class */
export class Search_ implements module_prop {
	form_name: string;
	submit_el: HTMLElement;
	no_result_el: HTMLElement;
	result_container_el: HTMLElement;
	loader_el: HTMLElement;
	request_action: string;
	prod_directory_url: string;
	ctgr_select: HTMLElement;
	brand_select: HTMLElement;
	item_html: string;
	selection_start: string;
	selection_end: string;

	hidden_class: string;
	res_data_attr: string;
	res_data_attr_names: search_arg_attr_names;

	search_str?: string;

	constructor(prop: search_arg_prop = MODULE_PROP) {
		if(prop.res_data_attr_names) this.res_data_attr_names = prop.res_data_attr_names;
		else this.res_data_attr_names = MODULE_PROP.res_data_attr_names;

		this.form_name = prop.form_name;
		this.submit_el = document.getElementById(prop.submit_id);
		this.no_result_el = document.getElementById(prop.no_result_id);
		this.result_container_el = document.getElementById(prop.result_container_id);
		this.loader_el = document.getElementById(prop.loader_id);
		this.request_action = prop.request_action;
		this.prod_directory_url = prop.prod_directory_url;
		this.hidden_class = prop.hidden_class;
		this.res_data_attr = prop.res_data_attr;
		this.ctgr_select = $(`[${this.res_data_attr}='${prop.ctgr_select}']`)[0];
		this.brand_select = $(`[${this.res_data_attr}='${prop.brand_select}']`)[0];
		this.item_html = this.result_container_el.innerHTML;
		this.result_container_el.innerHTML = "";
		this.selection_start = prop.selection_start;
		this.selection_end = prop.selection_end;

		this.submit_el.addEventListener("click", (e) => {
			e.preventDefault();
			this.submit();
		});

		let categories_obj: category_prop;
		let brands_obj: category_prop;
		let interval_id: number;
		interval_id = window.setInterval(() => {
			if(categories) {
				if(categories.categories) {
					categories_obj = categories.categories;
					let old_content_ctgr = $(this.ctgr_select).html();
					for(let i = 0; i < categories_obj.items.length; i++) {
						let category = `<option value="${categories_obj.items[i].name}">${categories_obj.items[i].title}</option>`;
						old_content_ctgr += category;
					}
					$(this.ctgr_select).html(old_content_ctgr);
				}
				if(categories.brands) {
					brands_obj = categories.brands;
					let old_content_brand = $(this.brand_select).html();
					for(let i = 0; i < brands_obj.items.length; i++) {
						let brand = `<option value="${brands_obj.items[i].name}">${brands_obj.items[i].title}</option>`;
						old_content_brand += brand;
					}
					$(this.brand_select).html(old_content_brand);
				}

				window.clearInterval(interval_id);
			}
		}, 2000);
	}

	private compileRes(data: any): void {
		$(this.result_container_el).append(this.item_html);
		let el = $(this.result_container_el).find(`[${this.res_data_attr}='${this.res_data_attr_names.item}']`).last();

		$(el).attr("href", this.prod_directory_url + data.url);
		$(el).find(`[${this.res_data_attr}='${this.res_data_attr_names.image}']`).attr("src", data.main_photo);

		let item_name = data.name.replace(new RegExp(this.search_str, "ig"), (this.selection_start + "$&" + this.selection_end));
		$(el).find(`[${this.res_data_attr}='${this.res_data_attr_names.name}']`).html(item_name);

		let ctgr: string;
		if(data.category_title) ctgr = data.category_title;
		else ctgr = data.category_name;
		$(el).find(`[${this.res_data_attr}='${this.res_data_attr_names.category}']`).text(ctgr);

		if(data.describe) {
			let item_descr = data.describe.replace(new RegExp(this.search_str, "ig"), (this.selection_start + "$&" + this.selection_end));
			$(el).find(`[${this.res_data_attr}='${this.res_data_attr_names.description}']`).html(item_descr);
		}

	}
	private submit(): void {
		let valid = validation.validateForm(this.form_name);
		if(valid) {
			let data = validation.getData(this.form_name);
			let req_data: search_prop = {
				name: <string> data.search
			};
			this.search_str = <string> data.search;
			if(data.category && data.category != "all_categories") req_data.category = <string> data.category;
			if(data.brand && data.brand != "all_brands") req_data.brand = <string> data.brand;
			if(data.check_description && data.check_description != "no") req_data.check_description = true;

			this.request(req_data);
		}
	}
	private request(req_data: search_prop): void {
		let req_str = "?";
		req_str += `name=${req_data.name}`;
		if(req_data.category) req_str += `&category=${req_data.category}`;
		if(req_data.brand) req_str += `&brand=${req_data.brand}`;
		if(req_data.check_description) req_str += `&check_description=${req_data.check_description}`;

		let callback = (data: any) => {
			this.result_container_el.innerHTML = "";
			if(data instanceof Array && data.length) {
				this.no_result_el.classList.add(this.hidden_class);

				for(let i = 0; i < data.length; i++) {
					this.compileRes(data[i]);
				}
			} else {
				this.no_result_el.classList.remove(this.hidden_class);
			}
		}
		let prop: getReqObj = {
			action: this.request_action + req_str,
			callbacks: {
				success: callback
			},
			responsType: "json"
		};
		Request_._get(prop);
	}
}