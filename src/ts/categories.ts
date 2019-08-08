/* Categories module ----------------------- */

/* jQuery connect ---------------- */
import * as $ from "jquery";

import {categories} from "./@types/global";
import {RangeProp, RangeValues, RangeErrMsg, rangeDQS, RangeFilter} from "./plug-modules/range-filter";


/* arguments interfaces */
export interface ctgr_arg_prop_names {
	block_selector: string;
	item_list_selector: string;
	category_title: string;
	item_list_type: string;
	check_type: string;
	like_radio_type: string;

	check_item_type_attr: string;

	range_block_id: string;
	range_block_type: string;
}
export type ctgr_getter_fc = Function | Function[];
export interface ctgr_arg_prop {
	getter_fc: Function | Function[];

	data_attr: string;
	data_attr_names: ctgr_arg_prop_names
}

const DEF_ARG_PROP: ctgr_arg_prop = {
	getter_fc: null,

	data_attr: "data-in",
	data_attr_names: {
		block_selector: ".selector_block-item",
		item_list_selector: ".selector_item_list",
		category_title: "selector_category_title",
		item_list_type: "list_type",
		check_type: "selector_checkbox-item",
		like_radio_type: "selector_string-item",

		check_item_type_attr: "data-input-prop",

		range_block_id: "selector_price_range",
		range_block_type: "range_filter"
	}
};


interface prop_class {
	form_el: HTMLElement;
	getter_fc?: Function | Function[];

	data_attr: string;
	data_attr_names: ctgr_arg_prop_names
}

export class Categories_ implements prop_class {
	form_el: HTMLElement;
	getter_fc?: Function | Function[];

	data_attr: string;
	data_attr_names: ctgr_arg_prop_names

	categories: categories_;

	check_item_html: JQuery<HTMLElement>;


	constructor(form_id: string, prop?: ctgr_arg_prop | ctgr_getter_fc) {
		let all_prop = DEF_ARG_PROP;
		if(prop && (prop instanceof Function || prop instanceof Array)) this.getter_fc = prop;
		else if(prop) all_prop = <ctgr_arg_prop> prop;

		this.form_el = document.getElementById(form_id);
		if(all_prop.getter_fc) this.getter_fc = all_prop.getter_fc;
		this.data_attr = all_prop.data_attr;
		this.data_attr_names = {
			block_selector: all_prop.data_attr_names.block_selector,
			item_list_selector: all_prop.data_attr_names.item_list_selector,
			item_list_type: all_prop.data_attr_names.item_list_type,
			category_title: all_prop.data_attr_names.category_title,
			check_item_type_attr: all_prop.data_attr_names.check_item_type_attr,
			range_block_id: all_prop.data_attr_names.range_block_id,
			range_block_type: all_prop.data_attr_names.range_block_type,
			check_type: all_prop.data_attr_names.check_type,
			like_radio_type: all_prop.data_attr_names.like_radio_type
		};
		this.check_item_html = $(`[${this.data_attr}='${this.data_attr_names.item_list_type}']`).clone();
		$(`[${this.data_attr}='${this.data_attr_names.item_list_type}']`).remove();

		let interval_id: number;
		interval_id = window.setInterval(() => {
			if(categories) {
				this.categories = categories;
				if(categories.price_filter) this.compileRangeFilter();
				for(let key in categories) {
					if(key == "price_filter") continue;
					this.compileCheckItems(key);
				}

				window.clearInterval(interval_id);
			}
		}, 2000);
	}

	private compileCheckItems(key: string): void {
		let element = this.categories[key];
		let block_new = $(this.check_item_html).clone();

		block_new.find(`[${this.data_attr}='${this.data_attr_names.category_title}']`).text(element.title);
		let list_block = $(block_new).find(this.data_attr_names.item_list_selector);
		let item_input = $(list_block).find("input").clone();
		let item_label = $(list_block).find("label").clone();
		$(list_block).empty();

		for(let i = 0; i < element.items.length; i++) {
			let item = element.items[i];
			let id = `check_${key}_${item.name}`;

			let item_input_new = $(item_input).clone();
			item_input_new.attr("name", item.name);
			item_input_new.attr("id", id);
			item_input_new.attr("value", item.name);
			item_input_new.attr(this.data_attr_names.check_item_type_attr, element.data_input_prop);
			item_input_new.on("change", (e) => {
				let name = (<HTMLInputElement> e.target).name;
				let value = (<HTMLInputElement> e.target).checked;

				this.changeCtgr(element, name, value);
				this.performGetter();
			});

			let item_label_new = $(item_label).clone();
			item_label_new.addClass(element.data_input_prop).attr("for", id).text(item.title);

			list_block.append(item_input_new);
			list_block.append(item_label_new);
		}
		if(element.first) $(this.form_el).prepend(block_new);
		else $(this.form_el).append(block_new);
	}
	private compileRangeFilter(): void {
		$(`[${this.data_attr}='${this.data_attr_names.range_block_type}']`).find(`[${this.data_attr}='${this.data_attr_names.category_title}']`).text(this.categories.price_filter.title);

		let rangeFilter: RangeFilter;
		let prop: RangeProp = {
			limit_top: this.categories.price_filter.top_point,
			limit_bottom: this.categories.price_filter.bottom_point,
			value_top: this.categories.price_filter.top_val,
			value_bottom: this.categories.price_filter.bottom_val,
			precision: 10
		};
		let callback = () => {
			let val: RangeValues = rangeFilter.getValues;
			this.categories.price_filter.top_val = val.top;
			this.categories.price_filter.bottom_val = val.bottom;

			this.performGetter();
		};
		rangeFilter = new RangeFilter(this.data_attr_names.range_block_id, prop, callback);
		rangeFilter.launchModule();
	}
	private performGetter(): void {
		if(this.getter_fc) {
			let categories = this.getData();
			if(this.getter_fc instanceof Function) this.getter_fc(categories);
			else if(this.getter_fc instanceof Array) {
				for(let i = 0; i < this.getter_fc.length; i++) this.getter_fc[i](categories);
			}
		}
	}
	public setGetterFc(func: Function | Function[]): void {
		this.getter_fc = func;
	}
	public getData(): categories_ {
		let categories: categories_ = {};

		for(let key in this.categories) {
			if(key == "price_filter") {
				categories[key] = this.categories[key];
				continue;
			}
			let el = this.categories[key];
			let el_new: category_prop = {
				name: el.name,
				title: el.title,
				data_input_prop: el.data_input_prop
			};
			let items = el.items;
			let items_new: {name: string; title: string;}[] = [];
			let not_null = true;

			for(let i = 0; i < items.length; i++) {
				if(items[i].title === null) {
					not_null = false;
					items_new[items_new.length] = items[i];
				}
			}

			el_new.items = items_new;

			if(!not_null) categories[key] = el_new;
		}

		return categories;
	}
	private changeCtgr(el: category_prop, name: string, value: boolean): void {
		let tp = el.data_input_prop;

		for(let i = 0; i < el.items.length; i++) {
			if(el.items[i].name == name) {
				if(value) el.items[i].title = null;
				else el.items[i].title = "str";
			} else {
				if(tp == this.data_attr_names.like_radio_type) {
					el.items[i].title = "str";
					let id = `check_${el.name}_${el.items[i].name}`;
					(<HTMLInputElement> document.getElementById(id)).checked = false;
				}
			}
		}
	}
}