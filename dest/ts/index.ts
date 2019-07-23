/* IMPORTMODULES ------------------------------------------------------------ */

/* jQuery connect ---------------- */
/* Slick connect ----------------- */
/// <reference path="@types/slick/index.d.ts"/>

/* module DOM services ---------------- */
function getAttrVal(el: HTMLElement, attr_name: string): string {
	return el.querySelector("["+attr_name+"]").getAttribute(attr_name);
}
/* module Tooltip perform ------------- */
function performTooltip(el: HTMLElement, text: string): void {
	const hidden_class = "hidden-tooltip";
	const time = 1000;
	const tooltip: HTMLElement = document.getElementById("tooltip");
	
	interface Dimension {
		left: number;
		top: number;
		width?: number;
	}
	let win_width: number;
	
	tooltip.classList.add(hidden_class);
	tooltip.style.display = "none";
	tooltip.style.width = "auto";
	tooltip.style.right = "auto";
	win_width = document.documentElement.clientWidth;
	let el_coord = el.getBoundingClientRect();
	let el_dimens: Dimension = {
		top: el_coord.top + (window.scrollY || window.pageYOffset),
		left: el_coord.left,
		width: el_coord.right - el_coord.left
	};
	let tt_dimens: Dimension = {
		top: el_coord.bottom,
		left: el_dimens.left + (el_dimens.width / 2)
	};
	
	tooltip.style.display = "block";
	tooltip.innerHTML = text;
	tooltip.style.top = tt_dimens.top + "px";
	tooltip.style.left = tt_dimens.left + "px";
	tooltip.classList.remove(hidden_class);
	let tt_coord = tooltip.getBoundingClientRect();
	tt_dimens.width = tt_coord.right - tt_coord.left;
	if(tt_dimens.width > +(win_width / 100 * 95).toFixed(0)) {
		tt_dimens.width = +(win_width / 100 * 95).toFixed(0);
	}
	if(tt_dimens.width + tt_dimens.left > win_width) {
		if(win_width - tt_dimens.left + tt_dimens.width > win_width) {
			if(tt_dimens.left > win_width / 2) {
				tooltip.style.left = "auto";
				tooltip.style.right = (win_width / 100 * 2).toFixed(0) + "px";
			} else {
				tooltip.style.left = (win_width / 100 * 2).toFixed(0) + "px";
			}
		} else {
			tooltip.style.left = "auto";
			tooltip.style.right = tt_dimens.left + "px";
		}
	}
	tooltip.style.width = tt_dimens.width + "px";
	
	setTimeout(() => {
		tooltip.classList.add(hidden_class);
	}, time);
}
/* module Copy Text Element to Buffer ------------- */

function CopyTextToBuffer(trigger_id: string, text_el_selector: string, tooltip_msg: string = "The text was copied"): void {
	let trigger_el: HTMLElement = document.getElementById(trigger_id);
	if(trigger_el) {
		let text_el: HTMLElement = trigger_el.querySelector(text_el_selector);
		trigger_el.onclick = (e) => {
			e.preventDefault();
			if(document.createRange) {
				let range = document.createRange();
				range.selectNodeContents(text_el);
				let selection = window.getSelection();
				selection.removeAllRanges();
				selection.addRange(range);
				document.execCommand("copy", false, null);
				selection.removeAllRanges();
				performTooltip(text_el, tooltip_msg);
			}
		};
	}
}
/* module Load More ---------------- */
function loadMore(operation: string): void {
	const loader: HTMLElement = document.getElementById("loader");
	const body: HTMLElement = document.body;
	const style_open: string = "open";
	const style_blocked_body: string = "noscroll";
	const act_open: string = "open";
	const act_close: string = "close";
	if(operation == act_open) {
		loader.classList.add(style_open);
		body.classList.add(style_blocked_body);
	} else if(operation == act_close) {
		loader.classList.remove(style_open);
		body.classList.remove(style_blocked_body);
	}
}
/* module Popup */

/* In order to manage popups using default properties with interface PopupProp (below) or pass your properties to constructor. This module by itself opens popup after trigger on an element with the attribute using value of attributes trigger and popup. Also it close popup after trigger on element with close attribute. You can by yourself open and close popups using methods open and close. You should to pass argument - value of data attribute of popup. After module initialization run method launchModule. */

interface PopupProp {
	// class for open element
	readonly body_class: string;
	readonly container_class: string;
	readonly container_animate_class: string;
	readonly popup_class: string;

	readonly container_id: string;
	readonly wrap_selector?: string;
	// names of data attributes that controls popup
	readonly popup_data_attr: string;
	readonly init_data_attr: string;
	// this without value
	readonly close_data_attr: string;
}
interface PopupData {
	[item: string]: HTMLElement;
}


/* An initial trigger element must to contain 'data-popup-init' attribute with string that contain a target popup block in the attribute 'data-popup-targ'
*/
const POPUP_DEF_PROP: PopupProp = {
	body_class: "noscroll",
	container_class: "display-popup",
	container_animate_class: "animate-popup",
	popup_class: "display-popup",
	container_id: "popups",
	wrap_selector: ".popups-frame_wrap",
	popup_data_attr: "data-popup-targ",
	init_data_attr: "data-popup-init",
	close_data_attr: "data-popup-close"
};

class PopupTrigger {
	readonly prop: PopupProp;
	readonly init_El: NodeList;
	readonly close_El: NodeList;
	readonly targ_El: PopupData;
	private _active_title: string | false;
	private _active_callback?: Function;
	readonly body_El: HTMLElement;
	readonly container: HTMLElement;
	readonly wrap_El?: HTMLElement;

	constructor(prop: PopupProp = POPUP_DEF_PROP) {
		this.prop = prop;
		this.body_El = document.body;
		this.container = document.getElementById(this.prop.container_id);
		if(prop.wrap_selector) {
			let wrap_El: HTMLElement = document.querySelector(prop.wrap_selector);
			if(wrap_El) this.wrap_El = wrap_El;
		}
		this.init_El = document.querySelectorAll("[" + this.prop.init_data_attr + "]");
		this.close_El = document.querySelectorAll("[" + this.prop.close_data_attr + "]");
		let targ_El = document.querySelectorAll("[" + this.prop.popup_data_attr + "]");
		this.targ_El = {};
		for(let i = 0; i < targ_El.length; i++) {
			let title = (<HTMLElement> targ_El[i]).getAttribute(this.prop.popup_data_attr);
			this.targ_El[title] = <HTMLElement> targ_El[i];
		}
		this._active_title = "cart";
	}

	open(title: string, callback?: Function): void {
		if(this._active_title) this.close(this._active_title);
		this.container.classList.add(this.prop.container_class);
		this.body_El.classList.add(this.prop.body_class);
		let target = this.targ_El[title];
		target.classList.add(this.prop.popup_class);
		this._active_title = title;
		if(callback) this._active_callback = callback;
	}
	close(title?: string | false): void {
		let active_title = title || this._active_title;
		let target: HTMLElement;
		if(active_title) {
			target = this.targ_El[active_title];
			this._active_title = false;
			if(title) target.classList.remove(this.prop.popup_class);
		}
		if(!title) {
			this.container.classList.remove(this.prop.container_animate_class);
			setTimeout((() => {
				this.container.classList.remove(this.prop.container_class);
				this.body_El.classList.remove(this.prop.body_class);
				target.classList.remove(this.prop.popup_class);
				this.container.classList.add(this.prop.container_animate_class);
				if(this._active_callback) {
					this._active_callback();
					this._active_callback = null;
				}
			}).bind(this), 400);
		}
	}
	launchModule(): void {
		for(let i = 0; i < this.init_El.length; i++) {
			this.init_El[i].addEventListener("click", ((e: Event) => {
				e.preventDefault();
				let title: string = (<HTMLElement> e.currentTarget).getAttribute(this.prop.init_data_attr);
				this.open(title);
			}).bind(this));
		}
		for(let j = 0; j < this.close_El.length; j++) {
			this.close_El[j].addEventListener("click", ((e: Event) => {
				e.preventDefault();
				this.close();
			}).bind(this));
		}
		if(this.wrap_El) {
			this.wrap_El.addEventListener("click", ((e: Event) => {
				if(e.currentTarget == e.target) {
					this.close();
				}
			}).bind(this));
		}
	}
}
/* module Range Filter ----------------- */
/* 
 * This module requires for its execution three types of data:
 * - wrapper id - you must to pass it via first argument in class
 * - properties - min, max, initial top and bottom values -
 * you can to pass this values in two ways: in object with interface RangeProp as second argument
 * and in an attributes in the wrap container.
 * This 'data-' attributes describes below in object rangeDefQuerySelectors.
 * - DOM elements - it configures performing of module on HTML.
 * You can to pass the attributes via third argument or use attribute names from object rangeDefQuerySelectors.
 * 
 *  There are three public functions:
 *  - launchModule - you must to run this function after initialization
 *  - getValues - it serves the values using interface RangeValues
 *  - setTopValue(number) - it sets top value
 *  - setBottomValue(number) - it sets bottom value */

interface RangeProp {
	readonly limit_top: number;
	readonly limit_bottom: number;
	value_top: number;
	value_bottom: number;
	readonly precision: number;
}
interface RangeValues {
	top: number;
	bottom: number;
}
interface RangeWorkProp {
	readonly values: number;
	pixel_top: number;
	pixel_bottom: number;
	pixel_per_value: number;
	percent_per_pixel: number;
	wrap_space_width: number;
	wrap_space_x: number;
	space_width: number;
	width_lab_t: number;
	width_lab_b: number;
}
interface RangeDefValues {
	readonly percent_top: number;
	readonly percent_bottom: number;
	readonly absolute_side: string;
	readonly transform_top: string;
	readonly transform_bottom: string;
}
interface RangeErrMsg {
	readonly limit_top: string;
	readonly limit_bottom: string;
	readonly value_top: string;
	readonly value_bottom: string;
}
interface RangeDOM {
	readonly range_space: HTMLElement;
	readonly range_inner_space: HTMLElement;
	readonly top_label: HTMLElement;
	readonly top_lb_parent: HTMLElement;
	readonly top_point: HTMLElement;
	readonly bottom_label: HTMLElement;
	readonly bottom_lb_parent: HTMLElement;
	readonly bottom_point: HTMLElement;
	readonly top_input: HTMLInputElement;
	readonly bottom_input: HTMLInputElement;
	readonly invalid_msg: HTMLElement;
}
interface rangeDQS {
	range_space: string;
	range_inner_space: string;
	top_label: string;
	bottom_label: string;
	top_input: string;
	bottom_input: string;
	top_point: string;
	bottom_point: string;
	invalid_msg: string;
	limit_top?: string;
	limit_bottom?: string;
	value_top?: string;
	value_bottom?: string;
	precision?: number;
}
const rangeDefQuerySelectors: rangeDQS = {
	range_space: ".range_space",
	range_inner_space: ".range_inner-space",
	top_label: ".range_end-number",
	bottom_label: ".range_start-number",
	top_input: "#price_range_top_field",
	bottom_input: "#price_range_bottom_field",
	top_point: ".range_end-point",
	bottom_point: ".range_start-point",
	invalid_msg: ".range-invalid-msg",
	limit_top: "data-range-max-val",
	limit_bottom: "data-range-min-val",
	value_top: "data-range-top-val",
	value_bottom: "data-range-bottom-val",
	precision: 10
};
const RANGE_ERROR_MSG: RangeErrMsg = {
	limit_top: "Maximum value can not be higher ",
	limit_bottom: "Minimum value can not be lower ",
	value_top: "Maximum value can not be lower than minimum",
	value_bottom: "Minimum value can not be higher than maximum"
};
const RANGE_DEFAULTS: RangeDefValues = {
	percent_top: 100,
	percent_bottom: 0,
	absolute_side: "50%",
	transform_top: "translateX(50%)",
	transform_bottom: "translateX(-50%)"
};

class RangeFilter {
	wrap_el: HTMLElement;
	private _prop: RangeProp;
	private _work_prop: RangeWorkProp;
	readonly error_msg: RangeErrMsg;
	DOM: RangeDOM;
	readonly default_val: RangeDefValues;
	private _temp_val_top: number;
	private _temp_val_bottom: number;
	private _active_top_point: boolean;
	private _active_bottom_point: boolean;

	constructor(block_id: string, err_msg?: RangeErrMsg, properties?: RangeProp, DOM_selectors?: rangeDQS) {
		this.wrap_el = document.getElementById(block_id);
		this.default_val = RANGE_DEFAULTS;

		let prop: RangeProp = {
			limit_top: +getAttrVal(this.wrap_el, rangeDefQuerySelectors.limit_top),
			limit_bottom: +getAttrVal(this.wrap_el, rangeDefQuerySelectors.limit_bottom),
			value_top: +getAttrVal(this.wrap_el, rangeDefQuerySelectors.value_top),
			value_bottom: +getAttrVal(this.wrap_el, rangeDefQuerySelectors.value_bottom),
			precision: rangeDefQuerySelectors.precision
		};
		this._prop = properties || prop;

		this.DOM = {
			range_space: this.wrap_el.querySelector((DOM_selectors && DOM_selectors.range_space) || rangeDefQuerySelectors.range_space),
			range_inner_space: this.wrap_el.querySelector((DOM_selectors && DOM_selectors.range_inner_space) || rangeDefQuerySelectors.range_inner_space),
			top_label: this.wrap_el.querySelector((DOM_selectors && DOM_selectors.top_label) || rangeDefQuerySelectors.top_label),
			bottom_label: this.wrap_el.querySelector((DOM_selectors && DOM_selectors.bottom_label) || rangeDefQuerySelectors.bottom_label),
			top_input: this.wrap_el.querySelector((DOM_selectors && DOM_selectors.top_input) || rangeDefQuerySelectors.top_input),
			bottom_input: this.wrap_el.querySelector((DOM_selectors && DOM_selectors.bottom_input) || rangeDefQuerySelectors.bottom_input),
			top_point: this.wrap_el.querySelector((DOM_selectors && DOM_selectors.top_point) || rangeDefQuerySelectors.top_point),
			bottom_point: this.wrap_el.querySelector((DOM_selectors && DOM_selectors.bottom_point) || rangeDefQuerySelectors.bottom_point),
			invalid_msg: this.wrap_el.querySelector((DOM_selectors && DOM_selectors.invalid_msg) || rangeDefQuerySelectors.invalid_msg),
			top_lb_parent: this.wrap_el.querySelector((DOM_selectors && DOM_selectors.top_label) || rangeDefQuerySelectors.top_label).parentElement,
			bottom_lb_parent: this.wrap_el.querySelector((DOM_selectors && DOM_selectors.bottom_label) || rangeDefQuerySelectors.bottom_label).parentElement
		};

		let values: number = this._prop.limit_top - this._prop.limit_bottom;
		let wrap_space_clientRect = this.DOM.range_space.getBoundingClientRect();
		let pixel_per_value: number = +(wrap_space_clientRect.width / values).toFixed(2);
		let percent_per_pixel: number = +(this.default_val.percent_top / wrap_space_clientRect.width).toFixed(2);
		this._work_prop = {
			values: values,
			pixel_top: +((this._prop.value_top - this._prop.limit_bottom) * pixel_per_value).toFixed(2),
			pixel_bottom: +((this._prop.value_bottom - this._prop.limit_bottom) * pixel_per_value).toFixed(2),
			pixel_per_value: pixel_per_value,
			percent_per_pixel: percent_per_pixel,
			wrap_space_width: wrap_space_clientRect.width,
			wrap_space_x: wrap_space_clientRect.left,
			space_width: this.DOM.range_inner_space.getBoundingClientRect().width,
			width_lab_t: this.DOM.top_lb_parent.getBoundingClientRect().width,
			width_lab_b: this.DOM.bottom_lb_parent.getBoundingClientRect().width
		};
		this.error_msg = {
			limit_top: ((err_msg && err_msg.limit_top) || RANGE_ERROR_MSG.limit_top) + this._prop.limit_top,
			limit_bottom: ((err_msg && err_msg.limit_bottom) || RANGE_ERROR_MSG.limit_bottom) + this._prop.limit_bottom,
			value_top: (err_msg && err_msg.value_top) || RANGE_ERROR_MSG.value_top,
			value_bottom: (err_msg && err_msg.value_bottom) || RANGE_ERROR_MSG.value_bottom
		};
		this._temp_val_top = this._prop.value_top;
		this._temp_val_bottom = this._prop.value_bottom;
		this._active_top_point = false;
		this._active_bottom_point = false;
	}

	private setValue(el: HTMLInputElement, val: number): void {
		el.value = val.toString();
	}
	private setText(el: HTMLElement, text: number): void {
		el.innerHTML = text.toString();
	}
	private changeSpaceWidth(): void {
		this._work_prop.space_width = this.DOM.range_inner_space.getBoundingClientRect().width;
		this._work_prop.width_lab_t = this.DOM.top_lb_parent.getBoundingClientRect().width;
		this._work_prop.width_lab_b = this.DOM.bottom_lb_parent.getBoundingClientRect().width;
		let between_label: number = (this._work_prop.width_lab_t + this._work_prop.width_lab_b) / 2;
		if(between_label > this._work_prop.space_width) {
			this.DOM.top_lb_parent.style.right = "auto";
			this.DOM.top_lb_parent.style.left = this.default_val.absolute_side;
			this.DOM.top_lb_parent.style.transform = "translateX(" + (-(this._work_prop.space_width / 2 - 2) + "px") + ")";
			this.DOM.bottom_lb_parent.style.left = "auto";
			this.DOM.bottom_lb_parent.style.right = this.default_val.absolute_side;
			this.DOM.bottom_lb_parent.style.transform = "translateX(" + (this._work_prop.space_width / 2 - 2) + "px" + ")";
		} else {
			this.DOM.top_lb_parent.style.right = this.default_val.absolute_side;
			this.DOM.top_lb_parent.style.left = "auto";
			this.DOM.top_lb_parent.style.transform = this.default_val.transform_top;
			this.DOM.bottom_lb_parent.style.left = this.default_val.absolute_side;
			this.DOM.bottom_lb_parent.style.right = "auto";
			this.DOM.bottom_lb_parent.style.transform = this.default_val.transform_bottom;
		}
	}
	private setPadding(side: string): void {
		let value: number;
		if(side == "top") {
			value = +((this._work_prop.wrap_space_width - this._work_prop.pixel_top) * this._work_prop.percent_per_pixel).toFixed();
			this.DOM.range_space.style.paddingRight = value + "%";
		} else if(side == "bottom") {
			value = +(this._work_prop.pixel_bottom * this._work_prop.percent_per_pixel).toFixed();
			this.DOM.range_space.style.paddingLeft = value + "%";
		}
		this.changeSpaceWidth();
	}
	private setTop(val: number): void {
		this._prop.value_top = val;
		this._work_prop.pixel_top = +((this._prop.value_top - this._prop.limit_bottom) * this._work_prop.pixel_per_value).toFixed(2);
		this.setText(this.DOM.top_label, this._prop.value_top);
		this.setPadding("top");
	}
	private setBottom(val: number): void {
		this._prop.value_bottom = val;
		this._work_prop.pixel_bottom = +((this._prop.value_bottom - this._prop.limit_bottom) * this._work_prop.pixel_per_value).toFixed(2);
		this.setText(this.DOM.bottom_label, this._prop.value_bottom);
		this.setPadding("bottom");
	}
	private setPointTop(): void {
		this.setText(this.DOM.top_label, this._prop.value_top);
		this.setPadding("top");
	}
	private setPointBottom(): void {
		this.setText(this.DOM.bottom_label, this._prop.value_bottom);
		this.setPadding("bottom");
	}
	applyResize(e: Event): void {
		let wrap_space_clientRect = this.DOM.range_space.getBoundingClientRect();
		this._work_prop.wrap_space_width = wrap_space_clientRect.width;
		this._work_prop.wrap_space_x = wrap_space_clientRect.left;
		this._work_prop.pixel_per_value = +(wrap_space_clientRect.width / this._work_prop.values).toFixed(2);
		this._work_prop.percent_per_pixel = +(this.default_val.percent_top / wrap_space_clientRect.width).toFixed(2);
		this._work_prop.pixel_top = +((this._prop.value_top - this._prop.limit_bottom) * this._work_prop.pixel_per_value).toFixed(2);
		this._work_prop.pixel_bottom = +((this._prop.value_bottom - this._prop.limit_bottom) * this._work_prop.pixel_per_value).toFixed(2);
		let tem = this._work_prop;
	}
	initOnInput(e: Event): void {
		let el = e.target;
		let el_input: HTMLInputElement = <HTMLInputElement> el;
		let value: string = el_input.value;
		let num_val: number, side: string;
		const reg_number: RegExp = /^[0-9]+$/;
		if(el_input.name == this.DOM.top_input.name) {
			side = "top";
		} else if(el_input.name == this.DOM.bottom_input.name) {
			side = "bottom";
		}
		if(value !== "" && !reg_number.test(value)) {
			if(side == "top") {
				el_input.value = this._temp_val_top.toString();
			} else if(side == "bottom") {
				el_input.value = this._temp_val_bottom.toString();
			}
		} else {
			if(side == "top") {
				this._temp_val_top = parseInt(value);
			} else if(side == "bottom") {
				this._temp_val_bottom = parseInt(value);
			}
		}
	}
	initOnChange(e: Event): void {
		let el = e.target;
		let el_input: HTMLInputElement = <HTMLInputElement> el;
		let value: string = el_input.value;
		let num_val: number, side: string, valid_bool: boolean = true, valid_msg: string;
		if(el_input.name == this.DOM.top_input.name) {
			side = "top";
		} else if(el_input.name == this.DOM.bottom_input.name) {
			side = "bottom";
		}
		if(value == "" || isNaN(parseInt(value))) {
			valid_bool = false;
		} else {
			num_val = parseInt(value);
			if(side == "top") {
				if(num_val > this._prop.limit_top) {
					valid_bool = false;
					valid_msg = this.error_msg.limit_top;
				} else if(num_val < (this._prop.value_bottom + this._prop.precision * 2)) {
					valid_bool = false;
					valid_msg = this.error_msg.value_bottom;
				} else {
					this.setTop(num_val);
				}
			} else if(side == "bottom") {
				if(num_val < this._prop.limit_bottom) {
					valid_bool = false;
					valid_msg = this.error_msg.limit_bottom;
				} else if(num_val > (this._prop.value_top - this._prop.precision * 2)) {
					valid_bool = false;
					valid_msg = this.error_msg.value_top;
				} else {
					this.setBottom(num_val);
				}
			}
		}
		if(!valid_bool) {
			if(valid_msg) {
				this.DOM.invalid_msg.innerHTML = valid_msg;
				this.DOM.invalid_msg.classList.remove("hidden");
				setTimeout(() => {
					this.DOM.invalid_msg.classList.add("hidden");
				}, 3500);
			}
			if(side == "top") {
				el_input.value = this._prop.value_top.toString();
			} else if(side == "bottom") {
				el_input.value = this._prop.value_bottom.toString();
			}
		}
	}
	selectInput(e: Event): void {
		let el = e.target;
		let el_input: HTMLInputElement = <HTMLInputElement> el;
		el_input.select();
	}
	mouseDownTop(e: MouseEvent): void {
		if(e.target == e.currentTarget) {
			this.wrap_el.onmousemove = this.mouseMoveTop.bind(this);
			this.wrap_el.onmouseleave = this.mouseEndTop.bind(this);
			this._active_top_point = true;
		}
	}
	mouseMoveTop(e: MouseEvent): void {
		let mouseX: number = e.clientX;
		let pixel_top: number = mouseX - this._work_prop.wrap_space_x;
		let value_top: number = ~~(pixel_top / this._work_prop.pixel_per_value);
		if(value_top < this._prop.limit_top && value_top > (this._prop.value_bottom + this._prop.precision * 2)) {
			this._prop.value_top = Math.ceil(value_top / this._prop.precision) * this._prop.precision;
			this._work_prop.pixel_top = pixel_top;
			this.setPointTop();
		}
	}
	mouseEndTop(e: MouseEvent) {
		if(this._active_top_point) {
			this.setValue(this.DOM.top_input, this._prop.value_top);
			this.wrap_el.onmousemove = undefined;
			this.wrap_el.onmouseleave = undefined;
			this._active_top_point = false;
		}
	}
	mouseDownBottom(e: MouseEvent): void {
		if(e.target == e.currentTarget) {
			this.wrap_el.onmousemove = this.mouseMoveBottom.bind(this);
			this.wrap_el.onmouseleave = this.mouseEndBottom.bind(this);
			this._active_bottom_point = true;
		}
	}
	mouseMoveBottom(e: MouseEvent): void {
		let mouseX: number = e.clientX;
		let pixel_bottom: number = mouseX - this._work_prop.wrap_space_x;
		let value_bottom: number = ~~(pixel_bottom / this._work_prop.pixel_per_value);
		if(value_bottom > this._prop.limit_bottom && value_bottom < (this._prop.value_top - this._prop.precision * 2)) {
			this._prop.value_bottom = Math.floor(value_bottom / this._prop.precision) * this._prop.precision;
			this._work_prop.pixel_bottom = pixel_bottom;
			this.setPointBottom();
		}
	}
	mouseEndBottom(e: MouseEvent) {
		if(this._active_bottom_point) {
			this.setValue(this.DOM.bottom_input, this._prop.value_bottom);
			this.wrap_el.onmousemove = undefined;
			this.wrap_el.onmouseleave = undefined;
			this._active_bottom_point = false;
		}
	}
	public launchModule(): void {
		this.setTop(this._prop.value_top);
		this.setBottom(this._prop.value_bottom);
		this.DOM.top_input.addEventListener("input", this.initOnInput.bind(this));
		this.DOM.top_input.addEventListener("change", this.initOnChange.bind(this));
		this.DOM.top_input.addEventListener("focus", this.selectInput);
		this.DOM.bottom_input.addEventListener("input", this.initOnInput.bind(this));
		this.DOM.bottom_input.addEventListener("change", this.initOnChange.bind(this));
		this.DOM.bottom_input.addEventListener("focus", this.selectInput);
		this.DOM.top_point.addEventListener("mousedown", this.mouseDownTop.bind(this));
		document.addEventListener("mouseup", this.mouseEndTop.bind(this));
		this.DOM.bottom_point.addEventListener("mousedown", this.mouseDownBottom.bind(this));
		document.addEventListener("mouseup", this.mouseEndBottom.bind(this));
		let applyResize = this.applyResize.bind(this);
		let resizeTimer: number;
		window.addEventListener("resize", e => {
			clearTimeout(resizeTimer);
			resizeTimer = window.setTimeout(applyResize, 250);
		});
	}

	public get getValues(): RangeValues {
		let values: RangeValues = {
			top: this._prop.value_top,
			bottom: this._prop.value_bottom
		};
		return values;
	}
	public setTopValue(val: number): boolean {
		if(val < this._prop.limit_top && val > this._prop.value_bottom + this._prop.precision) {
			this.setTop(val);
			return true;
		} else return false;
	}
	public setBottomValue(val: number): boolean {
		if(val > this._prop.limit_bottom && val < this._prop.value_top + this._prop.precision) {
			this.setBottom(val);
			return true;
		} else return false;
	}
}
/* module Validation -------------------------------------------------------- */

/* For launch the module, execute:
 * new Validation
 * There you can to pass property argument ValidationProp (below).
 * If you omit the argument, module will get default propery that described below (const VALID_PROP).
 * For launch validation on particular form, execute method:
 * setForm
 * and pass arguments:
 * - FormArg - form properties
 * - validationCallFunc - optional - submit callback
 * Module by itself set up properties for hidden part of form.
 * If you change hidden state of form part, you should to execute method:
 * changeHidden
 * and pass arguments:
 * - form element/name string
 * - element with hidden css class - HTMLElement
 * - hidden state - boolean
 * You can attach to form some data for sending it to server.
 * To do it execute method:
 * setData
 * and pass arguments:
 * - form name string
 * - data: any
 * You can perform validation on demand and get boolean result. To do it execute:
 * validateForm
 * and add argument:
 * - form element/name string
 * You can perform submit on demand and get boolean result of validation but not callback executing. To do it execute:
 * submitForm
 * and add argument:
 * - form element/name string
 * You can to get input-elements data object (formData) from form. To do it execute:
 * getData
 * and add argument:
 * - form element/name string
 * You can reset form (form field values ...). Execute:
 * resetForm
 * and add argument:
 * - form element/name string */


// types for validation template
type TemplateTypes = string | number | RegExp;
// types for form submit element
type SubmitEl = HTMLInputElement | HTMLButtonElement;
// types for form initialization arguments
interface InpArg {
	required?: boolean;
	disabled?: boolean;
	valid_template?: TemplateTypes;
	blocked_template?: TemplateTypes; // it blocks enter invalid symbols
	start_validation?: "input" | "change"; // when to perform input validation
	callback?: Function;
}
interface FormArg {
	element: string | HTMLFormElement; // form element; string - form name
	submit_el?: string | SubmitEl; // string - form element name
	items?: {
		[item: string]: InpArg // string - input name
	};
	start_validation?: "input" | "change"; // property for entire form
}

// types for submit callback

interface formData { // data that you can get in callback - input elements value
	[item: string]: string | number; // string - input name; value - input value
	data?: any; // any data that you attached to particular form
}
type validationServerCall = boolean | [string]; // array of invalid input name
interface formCallFunc { // You must to execute this function in your callback and pass here your respond
	(server_resp: validationServerCall): void;
}
interface validationCallFunc { // callback function
	(form: HTMLFormElement, data: formData, call: formCallFunc): void;
	}


// module properties argument
interface ValidationProp {
	readonly valid_type_template?: { // template for input type validation
		[item: string]: TemplateTypes // string - input type
	};
	readonly type_blocked_template?: { // it blocks enter invalid symbols for input type
		[item: string]: TemplateTypes // string - input type
	};
	readonly hidden_class: string; // css class name - for control hidden part of form

	readonly wrap_selector?: string; // css selector; here add invalid css class; when omitted there add class to input element
	readonly inv_require_class: string; // invalid required css class
	readonly inv_valid_class: string; // invalid validation css class
	readonly inv_custom_class?: string; // invalid server validation css class
	readonly start_validation?: "input" | "change"; // when to start validation; property for entire module

	readonly valid_template_attr?: string; // data attribute name; pass it if you want to get validation template from data attribute on input element
	readonly blocked_template_attr?: string; // data attribute name
	readonly start_validation_attr?: string; // data attribute name
}

// default module properties
const VALID_PROP: ValidationProp = {
	valid_type_template: {
		"tel": /^[0-9\+\-\(\)]{8,16}$/,
		"email": /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
		"password": /^[a-zA-Z0-9]{6,}$/
	},
	type_blocked_template: {
		"number": /^[0-9]+$/,
		"tel": /^[0-9\+\-\(\)]+$/
	},
	hidden_class: "hidden",
	wrap_selector: ".input-parent",
	inv_require_class: "empty",
	inv_valid_class: "invalid",
	inv_custom_class: "invalid-server",
	start_validation: "change",
	valid_template_attr: "data-valid-template",
	blocked_template_attr: "data-blocked-template",
	start_validation_attr: "data-start-validation"
};
/* ------------------------ */


// types for form children elements
type Inp_gen = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
/* input instance class */
interface Inp {
	readonly name: string;
	readonly tag_name: string;
	wrap_element?: HTMLElement;
	readonly type: string;
	valid_state?: boolean;
	valid_custom_state?: boolean;
	hidden?: boolean;
	callback?: Function;
}
interface InpFunctions {
	validate_input(): void;
	performBlocked?(): void;
	setFunctions(): void;
	setInvalidCustom(): void;
	resetInput(): void;
	getValue(): string | number | false;
	setHidden(): void;
	delHidden(): void;
}
abstract class SetInpProperties implements Inp {
	name: string;
	tag_name: string;
	wrap_element?: HTMLElement;
	type: string;
	valid_state?: boolean;
	valid_custom_state?: boolean;
	hidden?: boolean;
	callback?: Function;

	readonly form_el: Form;
	readonly main_el: Validation;

	constructor(el: Inp_gen, form_el: Form, main_el: Validation, arg?: InpArg) {
		this.form_el = form_el;
		this.main_el = main_el;

		this.name = el.name;
		this.tag_name = el.tagName;
		if(this.main_el.prop.wrap_selector) {
			let wrap_el = <HTMLElement> el.closest(this.main_el.prop.wrap_selector);
			if(wrap_el) {
				this.wrap_element = wrap_el;
			}
		}
		this.type = el.type;
		if(arg && arg.callback) this.callback = arg.callback;
	}
}



interface Input {
	readonly element: HTMLInputElement | HTMLTextAreaElement;
	readonly start_value?: string | number;
	value?: string | number;
	readonly start_required: boolean;
	readonly start_disabled: boolean;
	required: boolean;
	disabled: boolean;
	valid_template?: TemplateTypes;
	blocked_template?: TemplateTypes;
	start_validation?: string;
}
type InputContainer = InpFunctions & Input;
class InputInstance extends SetInpProperties implements InputContainer {
	element: HTMLInputElement | HTMLTextAreaElement;
	start_value?: string | number;
	value?: string | number;
	start_required: boolean;
	start_disabled: boolean;
	required: boolean;
	disabled: boolean;
	valid_template?: TemplateTypes;
	blocked_template?: TemplateTypes;
	start_validation?: string;

	constructor(inp_el: HTMLInputElement | HTMLTextAreaElement, form_el: Form, main_el: Validation, item_arg?: InpArg) {
		super(inp_el, form_el, main_el, item_arg);

		this.element = inp_el;

		if(inp_el.value && inp_el.value !== " ") {
			if(this.type == "number" && !isNaN(+inp_el.value)) {
				this.start_value = +inp_el.value;
			} else {
				this.start_value = inp_el.value;
			}
		}

		let start_required: boolean, start_disabled: boolean;
		let valid_template: TemplateTypes, blocked_template: TemplateTypes, start_validation: string;
		if(item_arg) {
			start_required = item_arg.required;
			start_disabled = item_arg.disabled;
			valid_template = item_arg.valid_template;
			blocked_template = item_arg.blocked_template;
			start_validation = item_arg.start_validation;
		}
		this.start_required = start_required || inp_el.required || false;
		this.start_disabled = start_disabled || inp_el.disabled || false;
		this.required = this.start_required;
		this.disabled = this.start_disabled;

		function templateParser(t: string, tp: string): TemplateTypes {
			let template: TemplateTypes;
			let reg: RegExp = new RegExp(t.substring(1, t.length - 1));
			if(tp == "number" && (typeof +t === "number")) template = +t;
			else if(t[0] == "/" && t[t.length - 1] == "/" && reg) template = reg;
			else template = t;
			return template;
		};
		if(this.main_el.prop.valid_template_attr) {
			let temp: string | number | RegExp = inp_el.getAttribute(this.main_el.prop.valid_template_attr);
			if(temp) temp = templateParser(temp, this.type);
			valid_template = valid_template || temp;
		}
		if(this.main_el.prop.blocked_template_attr) {
			let temp: string | number | RegExp = inp_el.getAttribute(this.main_el.prop.blocked_template_attr);
			if(temp) temp = templateParser(temp, this.type);
			blocked_template = blocked_template || temp;
		}
		if(this.main_el.prop.start_validation_attr) start_validation = start_validation || inp_el.getAttribute(this.main_el.prop.start_validation_attr);
		if(valid_template) this.valid_template = valid_template;
		if(blocked_template) this.blocked_template = blocked_template;
		if(start_validation) this.start_validation = start_validation;
	}

	validate_input(): void {
		this.value = this.element.value;
		if(this.value === " ") this.value = "";
		if(!this.hidden) {
			let requir_b: boolean = true;
			let valid_b: boolean = true;

			if(this.required && !this.disabled && !this.value) requir_b = false;

			if(requir_b && this.valid_template && this.value) {
				if((this.valid_template instanceof RegExp) && !this.valid_template.test(this.value)) valid_b = false;
				else if((typeof this.valid_template == "number") && (+this.value !== this.valid_template)) valid_b = false;
				else if(((typeof this.valid_template == "string")) && (this.valid_template != this.value)) valid_b = false;
			}

			if(requir_b && valid_b && this.main_el.prop.valid_type_template && this.main_el.prop.valid_type_template[this.type] && this.value) {
				if(this.main_el.prop.valid_type_template[this.type] instanceof RegExp && !(<RegExp> this.main_el.prop.valid_type_template[this.type]).test(this.value)) valid_b = false;
				else if((typeof this.main_el.prop.valid_type_template[this.type] == "number") && (this.main_el.prop.valid_type_template[this.type] !== +this.value)) valid_b = false;
				else if((typeof this.main_el.prop.valid_type_template == "string") && this.main_el.prop.valid_type_template != this.value) valid_b = false;
			}

			this.valid_state = (requir_b && valid_b) || false;
			if(this.type == "number" && !isNaN(+this.value)) this.value = +this.value;

			let wrap_el: HTMLElement | HTMLInputElement | HTMLTextAreaElement = this.wrap_element || this.element;
			if(this.valid_state) {
				wrap_el.classList.remove(this.main_el.prop.inv_require_class);
				wrap_el.classList.remove(this.main_el.prop.inv_valid_class);
			} else if(!requir_b) {
				wrap_el.classList.add(this.main_el.prop.inv_require_class);
				wrap_el.classList.remove(this.main_el.prop.inv_valid_class);
			} else {
				wrap_el.classList.remove(this.main_el.prop.inv_require_class);
				wrap_el.classList.add(this.main_el.prop.inv_valid_class);
			}
			this.valid_custom_state = true;
			wrap_el.classList.remove(this.main_el.prop.inv_custom_class);
		} else this.valid_state = true;
		if(this.valid_state && this.callback) this.callback();
	}
	performBlocked(): void {
		if(this.element.value === " ") this.element.value = "";
		let value = this.element.value;
		let valid: boolean = true;
		let main_template: TemplateTypes;
		if(this.main_el.prop.type_blocked_template && this.main_el.prop.type_blocked_template[this.type]) main_template = this.main_el.prop.type_blocked_template[this.type];
		let template: TemplateTypes = this.blocked_template || main_template;

		if(value) {
			if((template instanceof RegExp) && !template.test(value)) valid = false;
			else if((typeof template == "number") && template !== +value) valid = false;
			else if((typeof template == "string") && template != value) valid = false;
		}
		if(valid) {
			if(this.type == "number" && !isNaN(+value)) this.value = +value;
			else this.value = value;
		} else if(this.value !== undefined) this.element.value = this.value.toString();
		else this.element.value = "";
	}
	setFunctions(): void {
		let input_event: boolean = false;
		let change_event: boolean = false;
		let validation: boolean = false;
		let blocked: boolean = false;

		input_event = (this.start_validation == "input") || (this.form_el.start_validation == "input") || (this.main_el.prop.start_validation == "input");
		change_event = (this.start_validation == "change") || (this.form_el.start_validation == "change") || (this.main_el.prop.start_validation == "change");
		if(this.start_required || this.valid_template || (this.main_el.prop.valid_type_template && this.main_el.prop.valid_type_template[this.type])) validation = true;
		if(this.blocked_template || (this.main_el.prop.type_blocked_template && this.main_el.prop.type_blocked_template[this.type])) blocked = true;
		input_event = validation && input_event;
		change_event = validation && change_event;

		if(blocked && input_event) {
			this.element.addEventListener("input", () => {
				this.performBlocked();
				this.validate_input();
			})
		} else {
			if(blocked) this.element.addEventListener("input", () => {
				this.performBlocked();
			});
			if(input_event) this.element.addEventListener("input", () => {
				this.validate_input();
			});
		}
		if(change_event) this.element.addEventListener("change", () => {
			this.validate_input();
		});
	}
	setInvalidCustom(): void {
		let wrap_el: HTMLElement | HTMLInputElement | HTMLTextAreaElement = this.wrap_element || this.element;
		this.valid_custom_state = false;
		wrap_el.classList.add(this.main_el.prop.inv_custom_class);
	}
	resetInput(): void {
		let wrap_el: HTMLElement | HTMLInputElement | HTMLTextAreaElement = this.wrap_element || this.element;
		wrap_el.classList.remove(this.main_el.prop.inv_require_class);
		wrap_el.classList.remove(this.main_el.prop.inv_valid_class);
		wrap_el.classList.remove(this.main_el.prop.inv_custom_class);
		this.value = undefined;
		this.valid_state = undefined;
		this.valid_custom_state = undefined;
		if(this.start_value) this.element.value = this.start_value.toString();
		else this.element.value = "";
	}
	getValue(): string | number | false {
		if(this.value && !this.hidden) return this.value;
		else return false;
	}
	setHidden(): void {
		this.hidden = true;
		this.required = false;
		this.disabled = true;
		this.element.required = false;
		this.element.disabled = true;
	}
	delHidden(): void {
		this.hidden = false;
		this.required = this.start_required;
		this.disabled = this.start_disabled;
		this.element.required = this.start_required;
		this.element.disabled = this.start_disabled;
	}
}



interface Select {
	readonly element: HTMLSelectElement;
	readonly start_value?: string;
	value?: string;
	readonly start_required: boolean;
	readonly start_disabled: boolean;
	required: boolean;
	disabled: boolean;
	start_validation?: "change";
}
type SelectContainer = InpFunctions & Select;
class SelectInstance extends SetInpProperties implements SelectContainer {
	element: HTMLSelectElement;
	start_value?: string;
	value?: string;
	start_required: boolean;
	start_disabled: boolean;
	required: boolean;
	disabled: boolean;
	start_validation?: "change";

	constructor(select_el: HTMLSelectElement, form_el: Form, main_el: Validation, item_arg?: InpArg) {
		super(select_el, form_el, main_el, item_arg);

		this.element = select_el;
		if(select_el.value) this.start_value = select_el.value;

		let start_required: boolean, start_disabled: boolean;
		let start_validation: "change";
		if(item_arg) {
			start_required = item_arg.required;
			start_disabled = item_arg.disabled;
			if(item_arg.start_validation && item_arg.start_validation == "change") start_validation = item_arg.start_validation;
		}
		this.start_required = start_required || select_el.required || false;
		this.start_disabled = start_disabled || select_el.disabled || false;
		this.required = this.start_required;
		this.disabled = this.start_disabled;

		if(this.main_el.prop.start_validation_attr && select_el.getAttribute(this.main_el.prop.start_validation_attr) == "change") start_validation = start_validation || "change";
		if(start_validation) this.start_validation = start_validation;
	}

	validate_input(): void {
		this.value = this.element.value;
		if(!this.hidden) {
			let requir_b: boolean = true;

			if(this.required && !this.element.disabled && !this.value) requir_b = false;
			this.valid_state = requir_b;

			let wrap_el: HTMLElement | HTMLSelectElement = this.wrap_element || this.element;
			if(this.valid_state) {
				wrap_el.classList.remove(this.main_el.prop.inv_require_class);
			} else {
				wrap_el.classList.add(this.main_el.prop.inv_require_class);
			}
			this.valid_custom_state = true;
			wrap_el.classList.remove(this.main_el.prop.inv_custom_class);
		} else this.valid_state = true;
		if(this.valid_state && this.callback) this.callback();
	}
	setFunctions(): void {
		let change_event: boolean = false;
		let validation: boolean = false;
		change_event = (this.start_validation == "change") || (this.form_el.start_validation == "change") || (this.main_el.prop.start_validation == "change");
		if(this.start_required) validation = true;
		change_event = validation && change_event;

		if(change_event) this.element.addEventListener("change", () => {
			this.validate_input();
		});
	}
	setInvalidCustom(): void {
		let wrap_el: HTMLElement | HTMLSelectElement = this.wrap_element || this.element;
		this.valid_custom_state = false;
		wrap_el.classList.add(this.main_el.prop.inv_custom_class);
	}
	resetInput(): void {
		let wrap_el: HTMLElement | HTMLSelectElement = this.wrap_element || this.element;
		wrap_el.classList.remove(this.main_el.prop.inv_require_class);
		wrap_el.classList.remove(this.main_el.prop.inv_custom_class);
		this.value = undefined;
		this.valid_state = undefined;
		this.valid_custom_state = undefined;
		if(this.start_value) this.element.value = this.start_value;
		else this.element.value = "";
	}
	getValue(): string | false {
		if(this.value && !this.hidden) return this.value;
		else return false;
	}
	setHidden(): void {
		this.hidden = true;
		this.required = false;
		this.disabled = true;
		this.element.required = false;
		this.element.disabled = true;
	}
	delHidden(): void {
		this.hidden = false;
		this.required = this.start_required;
		this.disabled = this.start_disabled;
		this.element.required = this.start_required;
		this.element.disabled = this.start_disabled;
	}
}



type checkValue = "no" | "yes";
interface Check {
	readonly element: HTMLInputElement;
	value: string | checkValue;
	readonly start_checked: boolean;
	checked: boolean;
	readonly start_required: boolean;
	readonly start_disabled: boolean;
	required: boolean;
	disabled: boolean;
	start_validation?: "change";
}
type CheckContainer = InpFunctions & Check;
class CheckInstance extends SetInpProperties implements CheckContainer {
	element: HTMLInputElement;
	value: string | checkValue;
	readonly start_checked: boolean;
	checked: boolean;
	start_required: boolean;
	start_disabled: boolean;
	required: boolean;
	disabled: boolean;
	start_validation?: "change";

	constructor(check_el: HTMLInputElement, form_el: Form, main_el: Validation, item_arg?: InpArg) {
		super(check_el, form_el, main_el, item_arg);

		this.element = check_el;

		if(this.element.value && this.element.value != "on") this.value = this.element.value;
		else this.value = "yes";
		let check: boolean = this.element.checked;
		this.start_checked = check;
		this.checked = check;

		let start_required: boolean, start_disabled: boolean;
		let start_validation: "change";
		if(item_arg) {
			start_required = item_arg.required;
			start_disabled = item_arg.disabled;
			if(item_arg.start_validation && item_arg.start_validation == "change") start_validation = item_arg.start_validation;
		}
		this.start_required = start_required || check_el.required || false;
		this.start_disabled = start_disabled || check_el.disabled || false;
		this.required = this.start_required;
		this.disabled = this.start_disabled;

		if(this.main_el.prop.start_validation_attr && check_el.getAttribute(this.main_el.prop.start_validation_attr) == "change") start_validation = start_validation || "change";
		if(start_validation) this.start_validation = start_validation;
	}

	validate_input(): void {
		this.checked = this.element.checked;
		if(!this.hidden) {
			let requir_b: boolean = true;

			if(this.required && !this.element.disabled && !this.checked) requir_b = false;
			this.valid_state = requir_b;

			if(this.checked) {
				if(this.element.value && this.element.value != "on") this.value = this.element.value;
				else this.value = "yes";
			}
			else this.value = "no";
			let wrap_el: HTMLElement | HTMLInputElement = this.wrap_element || this.element;
			if(this.valid_state) {
				wrap_el.classList.remove(this.main_el.prop.inv_require_class);
			} else {
				wrap_el.classList.add(this.main_el.prop.inv_require_class);
			}
			this.valid_custom_state = true;
			wrap_el.classList.remove(this.main_el.prop.inv_custom_class);
		} else this.valid_state = true;
		if(this.valid_state && this.callback) this.callback();
	}
	setFunctions(): void {
		let change_event: boolean = false;
		let validation: boolean = false;
		change_event = (this.start_validation == "change") || (this.form_el.start_validation == "change") || (this.main_el.prop.start_validation == "change");
		if(this.start_required) validation = true;
		change_event = validation && change_event;

		if(change_event) this.element.addEventListener("change", () => {
			this.validate_input();
		});
	}
	setInvalidCustom(): void {
		let wrap_el: HTMLElement | HTMLInputElement = this.wrap_element || this.element;
		this.valid_custom_state = false;
		wrap_el.classList.add(this.main_el.prop.inv_custom_class);
	}
	resetInput(): void {
		let wrap_el: HTMLElement | HTMLInputElement = this.wrap_element || this.element;
		wrap_el.classList.remove(this.main_el.prop.inv_require_class);
		wrap_el.classList.remove(this.main_el.prop.inv_custom_class);
		this.value = this.element.value || "no";
		this.checked = this.start_checked;
		this.element.checked = this.start_checked;
		this.valid_state = undefined;
		this.valid_custom_state = undefined;
	}
	getValue(): string | false {
		if(!this.hidden) return this.value;
		else return false;
	}
	setHidden(): void {
		this.hidden = true;
		this.required = false;
		this.disabled = true;
		this.element.required = false;
		this.element.disabled = true;
	}
	delHidden(): void {
		this.hidden = false;
		this.required = this.start_required;
		this.disabled = this.start_disabled;
		this.element.required = this.start_required;
		this.element.disabled = this.start_disabled;
	}
}



interface Radio {
	readonly element: RadioNodeList;
	readonly start_value?: string;
	value?: string;
	readonly start_required: boolean;
	readonly start_disabled?: Array<number>;
	disabled: Array<number>;
	start_validation?: "change";
}
type RadioContainer = InpFunctions & Radio;
class RadioInstance extends SetInpProperties implements RadioContainer {
	element: RadioNodeList;
	start_value?: string;
	value?: string;
	start_required: boolean;
	start_disabled?: Array<number>;
	disabled: Array<number>;
	start_validation?: "change";

	constructor(radio_el: RadioNodeList, form_el: Form, main_el: Validation, item_arg?: InpArg) {
		let element = <HTMLInputElement> radio_el[0];

		super(element, form_el, main_el, item_arg);

		this.element = radio_el;
		if(this.element.value) {
			this.start_value = this.element.value;
			this.value = this.element.value;
		}

		let disabled: Array<number> = [], start_valid_attr: string, start_validation: "change";;
		if(this.main_el.prop.start_validation_attr) start_valid_attr = this.main_el.prop.start_validation_attr;
		for(let i = 0; i < radio_el.length; i++) {
			let el = <HTMLInputElement> radio_el[i];
			if(el.disabled) disabled[i] = i;
			if(el.getAttribute(this.main_el.prop.start_validation_attr) == "change") start_validation = "change";
		}

		let start_required: boolean, start_disabled: boolean;
		if(item_arg) {
			start_required = item_arg.required;
			start_disabled = item_arg.disabled;
			if(item_arg.start_validation && item_arg.start_validation == "change") start_validation = "change";
		}
		this.start_required = start_required || false;
		this.disabled = [];
		if(start_disabled) {
			for(let j = 0; j < radio_el.length; j++) {
				this.disabled[j] = j;
			}
			this.start_disabled = this.disabled;
		} else if(disabled.length) {
			this.disabled = disabled;
			this.start_disabled = disabled;
		}

		if(start_validation) this.start_validation = start_validation;
	}

	validate_input(): void {
		if(this.element.value) this.value = this.element.value;
		else this.value = null;
		if(!this.hidden) {
			let requir_b: boolean = true;
			let notdisabled: boolean = false;

			if(this.start_required) {
				for(let i = 0; i < this.element.length; i++) {
					if(!(<HTMLInputElement> this.element[i]).disabled) {
						notdisabled = true;
						break;
					}
				}
			}

			if(this.start_required && notdisabled && !this.value) requir_b = false;
			this.valid_state = requir_b;

			let wrap_el: [HTMLElement] | RadioNodeList = [this.wrap_element] || this.element;
			if(this.valid_state) {
				wrap_el.forEach((el: HTMLElement | HTMLInputElement, i: number) => {
					el.classList.remove(this.main_el.prop.inv_require_class);
				});
			} else {
				wrap_el.forEach((el: HTMLElement | HTMLInputElement, i: number) => {
					el.classList.add(this.main_el.prop.inv_require_class);
				});
			}
			if(!this.valid_custom_state) {
				this.valid_custom_state = true;
				wrap_el.forEach((el: HTMLElement | HTMLInputElement, i: number) => {
					el.classList.remove(this.main_el.prop.inv_custom_class);
				});
			}
		} else this.valid_state = true;
		if(this.valid_state && this.callback) this.callback();
	}
	setFunctions(): void {
		let change_event: boolean = false;
		let validation: boolean = false;
		change_event = (this.start_validation == "change") || (this.form_el.start_validation == "change") || (this.main_el.prop.start_validation == "change");
		if(this.start_required) validation = true;
		change_event = validation && change_event;

		if(change_event) {
			for(let i = 0; i < this.element.length; i++) {
				let el = <HTMLInputElement> this.element[i];
				el.addEventListener("change", () => {
					this.validate_input();
				});
			}
		}
	}
	setInvalidCustom(): void {
		let wrap_el: [HTMLElement] | RadioNodeList = [this.wrap_element] || this.element;
		this.valid_custom_state = false;
		wrap_el.forEach((el: HTMLElement | HTMLInputElement, i: number) => {
			el.classList.add(this.main_el.prop.inv_custom_class);
		});
	}
	resetInput(): void {
		let wrap_el: [HTMLElement] | RadioNodeList = [this.wrap_element] || this.element;
		wrap_el.forEach((el: HTMLElement | HTMLInputElement, i: number) => {
			el.classList.remove(this.main_el.prop.inv_require_class);
			el.classList.remove(this.main_el.prop.inv_custom_class);
		});
		if(this.start_value) {
			this.value = this.start_value;
			this.element.value = this.start_value;
		} else {
			this.value = undefined;
			this.element.value = "";
		}
		this.valid_state = undefined;
		this.valid_custom_state = undefined;
	}
	getValue(): string | false {
		if(!this.hidden && this.value) return this.value;
		else return false;
	}
	setHidden(): void {
		this.hidden = true;
		for(let i = 0; i < this.element.length; i++) {
			this.disabled[i] = i;
			(<HTMLInputElement> this.element[i]).disabled = true;
		}
	}
	delHidden(): void {
		this.hidden = false;
		if(this.start_disabled) {
			this.disabled = this.start_disabled;
		}
		for(let i = 0; i < this.element.length; i++) {
			if(this.start_disabled[i]) (<HTMLInputElement> this.element[i]).disabled = true;
			else(<HTMLInputElement> this.element[i]).disabled = false;
		}
	}
}





/* form instance class */
type Inps = InputInstance | SelectInstance | CheckInstance | RadioInstance;
interface Form {
	readonly name: string;
	readonly element: HTMLFormElement;
	items: {
		[item: string]: Inps
	};
	data?: any;
	valid_state?: boolean;
	readonly start_validation?: string;
	readonly submit_el?: SubmitEl;
	callback?: validationCallFunc;
}
interface FormFunctions {
	validateForm(): boolean;
	submitForm(): boolean;
	setHidden(el: HTMLElement): void;
	delHidden(el: HTMLElement): void;
	checkHidden(): void;
	afterSubmit(server_resp: validationServerCall): void;
	getData(): formData;
	resetForm(): void;
}
type FormContainer = Form & FormFunctions;
class FormInstance implements FormContainer {
	name: string;
	element: HTMLFormElement;
	items: {
		[item: string]: Inps
	};
	data?: any;
	valid_state?: boolean;
	start_validation?: string;
	submit_el?: SubmitEl;
	callback?: validationCallFunc;

	readonly main_el: Validation;

	constructor(form: FormArg, main_el: Validation, call?: validationCallFunc) {
		this.main_el = main_el;
		if(call) this.callback = call;

		if(typeof form.element == "string") this.element = document.querySelector(`[name='${form.element}']`);
		else this.element = form.element;
		this.name = this.element.name;
		if(form.start_validation) this.start_validation = form.start_validation;
		if(form.submit_el) {
			if(typeof form.submit_el == "string") this.submit_el = this.element.querySelector(`[name='${form.submit_el}']`);
			else this.submit_el = form.submit_el;
			this.submit_el.addEventListener("click", (e: Event) => {
				e.preventDefault();
				this.submitForm();
				return false;
			});
		}

		let items: {[item: string]: Inps} = {};
		let inps = <HTMLFormControlsCollection> this.element.elements;


		let temp_radio_names: Array<string> = [];
		for(let i = 0; i < inps.length; i++) {
			let inp_el = <Inp_gen> inps[i];
			let item_arg: InpArg;
			if(form.items && form.items[inp_el.name]) item_arg = form.items[inp_el.name];
			let tag_name: string = inp_el.tagName;

			if((tag_name == "INPUT" && inp_el.type != "submit" && inp_el.type != "button" && inp_el.type != "checkbox" && inp_el.type != "radio") || tag_name == "TEXTAREA") {
				items[inp_el.name] = new InputInstance(<HTMLInputElement | HTMLTextAreaElement> inp_el, this, this.main_el, item_arg);
				items[inp_el.name].setFunctions();
			} else if(tag_name == "INPUT" && inp_el.type == "radio") {
				let tmp: boolean;
				for(let j = 0; j < temp_radio_names.length; j++) {
					if(inp_el.name == temp_radio_names[i]) tmp = true;
				}
				if(!tmp) {
					temp_radio_names.push(inp_el.name);
					items[inp_el.name] = new RadioInstance(<RadioNodeList> inps.namedItem(inp_el.name), this, this.main_el, item_arg);
					items[inp_el.name].setFunctions();
				}
			} else if(tag_name == "INPUT" && inp_el.type == "checkbox") {
				items[inp_el.name] = new CheckInstance(<HTMLInputElement> inp_el, this, this.main_el, item_arg);
				items[inp_el.name].setFunctions();
			} else if(tag_name == "SELECT") {
				items[inp_el.name] = new SelectInstance(<HTMLSelectElement> inp_el, this, this.main_el, item_arg);
				items[inp_el.name].setFunctions();
			}
		}
		this.items = items;

		this.checkHidden();
	}

	validateForm(): boolean {
		let valid: boolean = true;
		for(let key in this.items) {
			this.items[key].validate_input();
			if(!this.items[key].valid_state) valid = false;
		}
		this.valid_state = valid;
		return valid;
	}
	submitForm(): boolean {
		let valid: boolean = this.validateForm();
		let data: formData = {};

		if(valid) {
			if(this.data) data.data = this.data;
			for(let key in this.items) {
				let value = this.items[key].getValue();
				if(value) data[key] = value;
			}
			if(Object.keys(data).length) {
				if(this.callback) {
					valid = true;
					this.callback(this.element, data, (server_resp: validationServerCall) => {
						this.afterSubmit(server_resp);
					});
				} else valid = false;
			} else valid = false;
		}
		return valid;
	}
	resetForm(): void {
		if(this.data) this.data = undefined;
		for(let key in this.items) {
			this.items[key].resetInput();
		}
	}
	afterSubmit(server_resp: validationServerCall): void {
		let valid: boolean;
		if(typeof server_resp === "boolean") valid = server_resp;
		else {
			valid = false;
			if(Array.isArray(server_resp)) {
				for(let i = 0; i < server_resp.length; i++) {
					if(this.items[server_resp[i]]) {
						this.items[server_resp[i]].setInvalidCustom();
					}
				}
			}
		}
		if(valid) {
			this.resetForm();
		}
	}
	getData(): formData {
		let data: formData = {};
		if(this.data) data.data = this.data;
		for(let key in this.items) {
			let value = this.items[key].getValue();
			if(value) data[key] = value;
		}
		return data;
	}
	setHidden(el: HTMLElement): void {
		let inputs = el.querySelectorAll("input, textarea, select");
		for(let i = 0; i < inputs.length; i++) {
			let element = <Inp_gen> inputs[i];
			let tag_name: string = element.tagName;
			let inp_name: string = element.name;
			if((tag_name == "INPUT" && element.type != "submit") || tag_name == "SELECT" || tag_name == "TEXTAREA") {
				if(this.items[inp_name]) {
					this.items[inp_name].setHidden();

				}
			}
		}
	}
	delHidden(el: HTMLElement): void {
		let selector: string = `*:not(.${this.main_el.prop.hidden_class}) input, *:not(.${this.main_el.prop.hidden_class}) textarea, *:not(.${this.main_el.prop.hidden_class}) select`;
		let inputs = el.querySelectorAll(selector);

		for(let i = 0; i < inputs.length; i++) {
			let element = <Inp_gen> inputs[i];
			let tag_name: string = element.tagName;
			let inp_name: string = element.name;
			if((tag_name == "INPUT" && element.type != "submit") || tag_name == "SELECT" || tag_name == "TEXTAREA") {
				if(this.items[inp_name]) {
					this.items[inp_name].delHidden();
				}
			}
		}
	}
	checkHidden(): void {
		let hidden_elements = this.element.querySelectorAll("." + this.main_el.prop.hidden_class);
		for(let i = 0; i < hidden_elements.length; i++) {
			this.setHidden(<HTMLElement> hidden_elements[i]);
		}
	}
}



/* main validation class */
class Validation {
	private forms: {
		[item: string]: FormInstance
	};
	readonly prop: ValidationProp;

	constructor(prop: ValidationProp = VALID_PROP) {
		this.forms = {};
		this.prop = prop;
	}

	public setForm(form: FormArg, call?: validationCallFunc): void {
		let form_name: string;
		if(typeof form.element == "string") form_name = form.element;
		else form_name = form.element.name;

		this.forms[form_name] = new FormInstance(form, this, call);
	}

	public setData(f_name: string, data: any): void {
		let form = this.forms[f_name].data = data;
	}
	public getData(form: string | HTMLFormElement): formData {
		let form_name: string;
		if(typeof form == "string") form_name = form;
		else form_name = form.name;

		let data: formData = this.forms[form_name].getData();
		return data;
	}
	public changeHidden(form: string | HTMLFormElement, el: HTMLElement, hidden: boolean): void {
		let form_name: string;
		if(typeof form == "string") form_name = form;
		else form_name = form.name;

		if(hidden) this.forms[form_name].setHidden(el);
		else this.forms[form_name].delHidden(el);
	}
	public validateForm(form: string | HTMLFormElement): boolean {
		let form_name: string;
		if(typeof form == "string") form_name = form;
		else form_name = form.name;

		let res: boolean = this.forms[form_name].validateForm();
		return res;
	}
	public submitForm(form: string | HTMLFormElement): boolean {
		let form_name: string;
		if(typeof form == "string") form_name = form;
		else form_name = form.name;

		let res: boolean = this.forms[form_name].submitForm();
		return res;
	}
	public resetForm(form: string | HTMLFormElement): void {
		let form_name: string;
		if(typeof form == "string") form_name = form;
		else form_name = form.name;
		this.forms[form_name].resetForm();
	}
}

/* end Module Validation ---------------------------------------------------- */
// tslink:inject state-tasker.ts
// tslink:inject ajax.ts


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
