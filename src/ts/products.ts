/* Products module --------------- */

/* jQuery connect ---------------- */
import * as $ from "jquery";

import {categories, Product_selecotr, Cart, cart_product, productSlider, logged_user, Popup} from "./@types/global";
import {performTooltip} from "./plug-modules/tooltip";

import {ajax_methods, ajax_content_type, postReqObj, getReqObj, putReqObj, delReqObj, ajax_prop, Request_} from "./plug-modules/ajax";

/* argument interfaces */

export interface pr_prop {
	data_attr?: string;
	hidden_class?: string;
	active_class?: string;

	block_selector: string;
	container_attr_name?: string;
	block_type: "big item" | "little item" | "single item";
	max_item?: number;
	categories?: boolean;

	loadmore_btn_id?: string;
	loadmore_block_attr_name?: string;
	page_step?: number;

	request_action?: string;
}

/* end Argument interfaces */


/* working interfaces */
interface size_obj {
	any?: number;
	s?: number;
	m?: number;
	l?: number;
	xl?: number;
}
interface color_obj {
	name: string;
	title: string;
	hash?: string;
	class_name?: string;
	sizes: size_obj;
	el?: JQuery<HTMLElement>;
}
interface intro_product {
	_id: string;
	id: string;
	name: string;
	subtitle?: string;
	describe?: string;
	soc_networks?: {
		title: string;
		link: string;
		class_name?: string;
	}[];
	main_photo: string;
	photos?: string[],
	price: number;
	qty: color_obj[];
	related_prod?: {
		id: string;
		name?: string;
	}[] | intro_product[];
	category_title?: string;
	category_name?: string;
	brand_title?: string;
	brand_name?: string;
	url: string;
	types: string;
	liked?: boolean;
	rating?: number;
}

/* cless for various appearance of products */
interface product_item {
	color: string;
	size: string;
	qty: number;
	max_qty: number;
	total_price: number;
	main_el: JQuery<HTMLElement> | HTMLElement;

	item: intro_product;
	parent: Products_;
}

class bigItem implements product_item {
	color: string;
	size: string;
	qty: number;
	max_qty: number;
	total_price: number;
	main_el: JQuery<HTMLElement>;
	size_el: {
		s?: JQuery<HTMLElement>,
		l?: JQuery<HTMLElement>,
		m?: JQuery<HTMLElement>,
		xl?: JQuery<HTMLElement>
	};
	any_color: boolean;
	any_size: boolean;

	item: intro_product;
	parent: Products_;
	attr_names: attr_names_big_item;

	constructor(prod: intro_product, parent: Products_) {
		this.item = prod;
		this.parent = parent;
		this.attr_names = <attr_names_big_item> parent.data_attr_names;

		this.main_el = $(this.parent.html_el).clone();


		this.main_el.find(`[${this.parent.prop.data_attr}='${this.attr_names.product_url}']`).attr("href", this.attr_names.prod_directory_url + this.item.url);
		this.main_el.find(`[${this.parent.prop.data_attr}='${this.attr_names.main_image}']`).attr("src", this.item.main_photo);
		this.main_el.find(`[${this.parent.prop.data_attr}='${this.attr_names.product_name}']`).text(this.item.name);
		this.main_el.find(`[${this.parent.prop.data_attr}='${this.attr_names.product_price}']`).text(this.item.price);
		this.main_el.find(`[${this.parent.prop.data_attr}='${this.attr_names.soc_networks}']`).on("click", (e) => {
			e.preventDefault();
			let el = e.target;
			this.openSocNetwork(el);
		});
		this.main_el.find(`[${this.parent.prop.data_attr}='${this.attr_names.add_cart}']`).on("click", (e) => {
			e.preventDefault();
			let el = e.target;
			this.addToCart(el);
		});
		this.main_el.find(`[${this.parent.prop.data_attr}='${this.attr_names.like_btn}']`).on("click", (e) => {
			e.preventDefault();
			let el = e.target;
			this.performLike(el);
		});
		if(this.item.liked) this.main_el.find(`[${this.parent.prop.data_attr}='${this.attr_names.like_btn}']`).addClass(this.parent.prop.active_class);


		let noempty_sizes = {
			s: false,
			m: false,
			l: false,
			xl: false
		};
		this.size_el = {};
		let color_html = $(this.main_el).find(`[${this.parent.prop.data_attr}='${this.attr_names.product_color}'] button`).clone();
		$(this.main_el).find(`[${this.parent.prop.data_attr}='${this.attr_names.product_color}'] button`).remove();

		for(let i = 0; i < this.item.qty.length; i++) {
			if(this.item.qty[i].name == "any") {
				this.any_color = true;
				this.color = "any";

				if(this.item.qty[i].sizes.any) {
					this.any_size = true;
					this.size = "any";
					this.size_el = null;
					break;
				} else {
					for(let key in this.item.qty[i].sizes) {
						if(Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, key).value && Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, key).value > 0) Object.defineProperty(noempty_sizes, key, {value: true});
					}
				}
				break;
			} else {
				let color = this.item.qty[i];
				let contain_size: boolean = false;
				if(this.item.qty[i].sizes.any) {
					this.any_size = true;
					this.size = "any";
					this.size_el = null;
				} else {
					for(let key in color.sizes) {
						if(Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, key).value && Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, key).value > 0) {
							Object.defineProperty(noempty_sizes, key, {value: true});
							contain_size = true;
						}
					}
				}
				if(contain_size) {
					color.el = $(color_html).clone();
					color.el.attr(this.parent.prop.data_attr + "-color", color.name);
					if(color.class_name) color.el.addClass(color.class_name);
					if(color.hash) color.el.css("background-color", color.hash);
					color.el.on("click", (e) => {
						e.preventDefault();
						let el = e.target;
						this.chooseColor(el);
					});
					$(this.main_el).find(`[${this.parent.prop.data_attr}='${this.attr_names.color_container}']`).append(color.el);
				}
			}
		}
		if(this.any_color) $(this.main_el).find(`[${this.parent.prop.data_attr}='${this.attr_names.product_color}']`).remove();
		if(this.any_size) $(this.main_el).find(`[${this.parent.prop.data_attr}='${this.attr_names.product_sizing}']`).remove();
		else {
			for(let key in noempty_sizes) {
				if(Object.getOwnPropertyDescriptor(noempty_sizes, key).value) {
					let el = $(this.main_el).find(`[${this.parent.prop.data_attr}='${Object.getOwnPropertyDescriptor(this.attr_names.product_sizes, key).value}'] button`);
					el.on("click", (e) => {
						e.preventDefault();
						let el = e.target;
						this.chooseSize(el);
					});
					Object.defineProperty(this.size_el, key, {
						value: el,
						configurable: true,
						enumerable: true,
						writable: true
					});
				} else {
					$(this.main_el).find(`[${this.parent.prop.data_attr}='${Object.getOwnPropertyDescriptor(this.attr_names.product_sizes, key).value}']`).remove();
				}
			}
		}


		this.qty = 1;
		$(this.parent.prop.container_el).append(this.main_el);
	}

	performLike(el: HTMLElement): void {
		if(!el.classList.contains(this.attr_names.like_disabled_class)) {
			if(this.item.liked) {
				this.item.liked = false;
				el.classList.add(this.attr_names.like_active_class);

			} else {
				this.item.liked = true;
				el.classList.remove(this.attr_names.like_active_class);
			}
			let action = null;
			if(this.item.liked) action = this.attr_names.add_like_action;
			else action = this.attr_names.del_like_action;
			Request_._post({
				action: action,
				data: {
					id: this.item._id,
					types: this.item.types
				},
				callbacks: {
					success: () => {
						if(this.item.liked) $(this.main_el).find(`[${this.parent.prop.data_attr}='${this.attr_names.like_btn}']`).addClass(this.parent.prop.active_class);
						else $(this.main_el).find(`[${this.parent.prop.data_attr}='${this.attr_names.like_btn}']`).removeClass(this.parent.prop.active_class);
					}
				}
			});
		} else {
			performTooltip(el, "Login for like!");
		}
	}
	openSocNetwork(el: HTMLElement): void {
		if(this.item.soc_networks && this.item.soc_networks.length) {
			let soc_buttons = $(`[${this.attr_names.share_popup_attr}='${this.attr_names.share_popup_name}']`).find(`a[${this.parent.prop.data_attr}]`);
			for(let i = 0; i < soc_buttons.length; i++) {
				$(soc_buttons).addClass(this.parent.prop.hidden_class);
			}
			for(let i = 0; i < this.item.soc_networks.length; i++) {
				let attr_nm = Object.getOwnPropertyDescriptor(this.attr_names, "attr_name_" + this.item.soc_networks[i].title);
				let attr_name: string = null;
				if(attr_nm) attr_name = attr_nm.value;
				let soc_el = $(`[${this.attr_names.share_popup_attr}='${this.attr_names.share_popup_name}']`).find(`[${this.parent.prop.data_attr}='${attr_name}']`);
				if(soc_el) {
					soc_el[0].classList.remove(this.parent.prop.hidden_class);
					if(this.item.soc_networks[i].class_name) soc_el[0].classList.add(this.item.soc_networks[i].class_name);
					$(soc_el).attr("href", this.item.soc_networks[i].link);
				}
			}
			Popup.open(this.attr_names.share_popup_name);
		} else performTooltip(el, "There are no socnetworks");
	}
	addToCart(el: HTMLElement): void {

		if(!this.color) {
			color_loop: for(let i = 0; i < this.item.qty.length; i++) {
				if(!this.size) {
					for(let key in this.item.qty[i].sizes) {
						let descriptor = Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, key);
						if(descriptor && descriptor.value > 0) {
							this.color = this.item.qty[i].name;
							this.size = key;
							this.max_qty = descriptor.value;
							break color_loop;
						}
					}
				} else {
					let descriptor = Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, this.size);
					if(descriptor && descriptor.value > 0) {
						this.color = this.item.qty[i].name;
						this.max_qty = descriptor.value;
						break;
					}
				}
			}
		}
		if(!this.size) {
			color_loop: for(let i = 0; i < this.item.qty.length; i++) {
				if(this.item.qty[i].name == this.color) {
					for(let key in this.item.qty[i].sizes) {
						let descriptor = Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, key);
						if(descriptor && descriptor.value > 0) {
							this.size = key;
							this.max_qty = descriptor.value;
							break color_loop;
						}
					}
				}
			}
		}
		if(!this.max_qty) {
			for(let i = 0; i < this.item.qty.length; i++) {
				if(this.item.qty[i].name == this.color) this.max_qty = Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, this.size).value;
			}
		}

		let prod: cart_product = {
			_id: this.item._id,
			id: this.item.id,
			name: this.item.name,
			describe: this.item.describe,
			main_photo: this.item.main_photo,
			price: this.item.price,
			category_name: this.item.category_name,
			types: this.item.types,
			color: this.color,
			size: this.size,
			qty: this.qty,
			max_qty: this.max_qty,
			total_price: this.item.price * this.qty
		};
		if(Cart.addToCart(prod)) {
			el.classList.add(this.attr_names.cart_animation_class);
			this.restoreInitEl();
		}
		else performTooltip(el, "Already in the cart");
	}
	chooseSize(el: HTMLElement): void {
		let size = el.innerText;

		this.size = size;
		el.classList.add(this.parent.prop.active_class);
		let clearup_size: boolean = false;

		if(!this.any_color) {
			for(let i = 0; i < this.item.qty.length; i++) {
				let descriptor = Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, size);
				if(descriptor && descriptor.value > 0) {
					$(this.item.qty[i].el).removeClass(this.attr_names.empty_qty_class);
				} else {
					if(this.item.qty[i].el) {
						$(this.item.qty[i].el).addClass(this.attr_names.empty_qty_class);
						if(this.item.qty[i].name == this.color) {
							this.color = null;
							$(this.item.qty[i].el).removeClass(this.parent.prop.active_class);
							clearup_size = true;
						}
					}
				}
			}
		}
		for(let key in this.size_el) {
			let element = Object.getOwnPropertyDescriptor(this.size_el, key).value;
			if(key != size) $(element).removeClass(this.parent.prop.active_class);
			if(clearup_size) $(element).removeClass(this.attr_names.empty_qty_class);
		}
	}
	chooseColor(el: HTMLElement): void {
		let color = $(el).attr(this.parent.prop.data_attr + "-color");

		this.color = color;
		el.classList.add(this.parent.prop.active_class);
		let clearup_color: boolean = false;
		let element: color_obj = null;

		for(let i = 0; i < this.item.qty.length; i++) {
			if(this.item.qty[i].name != color) $(this.item.qty[i].el).removeClass(this.parent.prop.active_class);
			else element = this.item.qty[i];
		}
		if(!this.any_size) {
			for(let key in this.size_el) {
				let descriptor_size_qty = Object.getOwnPropertyDescriptor(element.sizes, key);
				let size_el = Object.getOwnPropertyDescriptor(this.size_el, key).value;
				if(descriptor_size_qty && descriptor_size_qty.value > 0) {
					$(size_el).removeClass(this.attr_names.empty_qty_class);
				} else {
					$(size_el).addClass(this.attr_names.empty_qty_class);
					if(key == this.size) {
						this.size = null;
						$(size_el).removeClass(this.parent.prop.active_class);
						clearup_color = true;
					}
				}
			}
		}
		if(clearup_color) {
			for(let i = 0; i < this.item.qty.length; i++) {
				$(this.item.qty[i].el).removeClass(this.attr_names.empty_qty_class);
			}
		}
	}
	restoreInitEl(): void {
		this.max_qty = null;
		this.total_price = null;
		if(!this.any_color) this.color = null;
		if(!this.any_size) this.size = null;
		if(Object.keys(this.size_el).length) {
			for(let key in this.size_el) {
				$(Object.getOwnPropertyDescriptor(this.size_el, key).value).removeClass(`${this.parent.prop.active_class} ${this.attr_names.empty_qty_class}`);
			}
		}
		for(let i = 0; i < this.item.qty.length; i++) {
			if(this.item.qty[i].el) $(this.item.qty[i].el).removeClass(`${this.parent.prop.active_class} ${this.attr_names.empty_qty_class}`);
		}
	}
}
export interface attr_names_big_item {
	product_url: string;
	prod_directory_url: string;
	main_image: string;
	product_name: string;
	product_price: string;
	product_sizing: string;
	product_sizes: {
		s: string;
		m: string;
		l: string;
		xl: string;
	},
	product_color: string;
	color_container: string;
	empty_qty_class: string;
	soc_networks: string;
	add_cart: string;
	cart_animation_class: string;
	like_btn: string;
	like_active_class: string;
	like_disabled_class: string;
	add_like_action: string;
	del_like_action: string;

	share_popup_name: string;
	share_popup_attr: string;
	attr_name_Facebook: string;
	attr_name_Twitter: string;
	attr_name_Google: string;
	attr_name_Instagram: string;
}
const ATTR_names_big_item: attr_names_big_item = {
	product_url: "product_url",
	prod_directory_url: "/products?url=",
	main_image: "product_image",
	product_name: "product_name",
	product_price: "product_price",
	product_sizing: "product_sizing",
	product_sizes: {
		s: "product_size_s",
		m: "product_size_m",
		l: "product_size_l",
		xl: "product_size_xl"
	},
	product_color: "product_color",
	color_container: "color_choose",
	empty_qty_class: "empty",
	soc_networks: "product_network",
	add_cart: "product_tocart",
	cart_animation_class: "add-cart-animation",
	like_btn: "product_like",
	like_active_class: "active",
	like_disabled_class: "disabled",
	add_like_action: "/addlike",
	del_like_action: "/dellike",

	share_popup_name: "share_product",
	share_popup_attr: "data-popup-targ",
	attr_name_Facebook: "social_facebook",
	attr_name_Twitter: "social_twitter",
	attr_name_Google: "social_google",
	attr_name_Instagram: "social_instagram"
};


class littleItem implements product_item {
	color: string;
	size: string;
	qty: number;
	max_qty: number;
	total_price: number;
	main_el: JQuery<HTMLElement>;

	item: intro_product;
	parent: Products_;
	attr_names: attr_names_little_item;

	constructor(prod: intro_product, parent: Products_) {
		this.item = prod;
		this.parent = parent;
		this.attr_names = <attr_names_little_item> parent.data_attr_names;

		this.main_el = $(this.parent.html_el).clone();


		this.main_el.find(`[${this.parent.prop.data_attr}='${this.attr_names.product_url}']`).attr("href", this.attr_names.prod_directory_url + this.item.url);
		this.main_el.find(`[${this.parent.prop.data_attr}='${this.attr_names.main_image}']`).attr("src", this.item.main_photo);
		this.main_el.find(`[${this.parent.prop.data_attr}='${this.attr_names.product_name}']`).text(this.item.name);
		this.main_el.find(`[${this.parent.prop.data_attr}='${this.attr_names.product_price}']`).text(this.item.price);
		this.main_el.find(`[${this.parent.prop.data_attr}='${this.attr_names.add_cart}']`).on("click", (e) => {
			e.preventDefault();
			let el = e.target;
			this.addToCart(el);
		});
		if(this.item.rating) {
			$(this.main_el.find(`[${this.parent.prop.data_attr}='${this.attr_names.rating_block}']`).addClass(this.attr_names.rating_class).find("*")[this.item.rating - 1]).addClass(this.attr_names.rating_class);
		}



		color_loop: for(let i = 0; i < this.item.qty.length; i++) {
			let color = this.item.qty[i];
			for(let key in color.sizes) {
				let qty = Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, key).value;
				if(qty && qty > 0) {
					this.size = key;
					this.color = this.item.qty[i].name;
					this.max_qty = qty;

					break color_loop;
				}
			}
		}


		this.qty = 1;
		$(this.parent.prop.container_el).append(this.main_el);
	}

	addToCart(el: HTMLElement): void {

		let prod: cart_product = {
			_id: this.item._id,
			id: this.item.id,
			name: this.item.name,
			describe: this.item.describe,
			main_photo: this.item.main_photo,
			price: this.item.price,
			category_name: this.item.category_name,
			types: this.item.types,
			color: this.color,
			size: this.size,
			qty: this.qty,
			max_qty: this.max_qty,
			total_price: this.item.price * this.qty
		};
		if(Cart.addToCart(prod)) {
			el.classList.add(this.attr_names.cart_animation_class);
		}
		else {
			performTooltip(el, "Already in the cart");
		}
	}
}
export interface attr_names_little_item {
	product_url: string;
	prod_directory_url: string;
	main_image: string;
	product_name: string;
	product_price: string;
	add_cart: string;
	cart_animation_class: string;
	rating_block: string;
	rating_class: string;
}
const ATTR_names_little_item: attr_names_little_item = {
	product_url: "product_url",
	prod_directory_url: "/products?url=",
	main_image: "product_image",
	product_name: "product_name",
	product_price: "product_price",
	add_cart: "product_tocart",
	cart_animation_class: "add-cart-animation",
	rating_block: "rating_stars",
	rating_class: "active"
};


class singleItem implements product_item {
	color: string;
	size: string;
	qty: number;
	max_qty: number;
	total_price: number;
	main_el: HTMLElement;
	size_el: {
		s?: JQuery<HTMLElement>,
		l?: JQuery<HTMLElement>,
		m?: JQuery<HTMLElement>,
		xl?: JQuery<HTMLElement>
	};
	any_color: boolean;
	any_size: boolean;

	item: intro_product;
	parent: Products_;
	attr_names: attr_names_single_item;

	constructor(prod: intro_product, parent: Products_) {
		this.item = prod;
		this.parent = parent;
		this.attr_names = <attr_names_single_item> parent.data_attr_names;

		this.main_el = this.parent.prop.block_el;


		$(this.main_el).find(`[${this.parent.prop.data_attr}='${this.attr_names.product_name}']`).text(this.item.name);
		if(this.item.subtitle) $(this.main_el).find(`[${this.parent.prop.data_attr}='${this.attr_names.product_subtitle}']`).text(this.item.subtitle);
		else $(this.main_el).find(`[${this.parent.prop.data_attr}='${this.attr_names.product_subtitle}']`).remove();
		if(this.item.describe) $(this.main_el).find(`[${this.parent.prop.data_attr}='${this.attr_names.product_describe}']`).text(this.item.describe);
		else $(this.main_el).find(`[${this.parent.prop.data_attr}='${this.attr_names.product_describe}']`).remove();
		$(this.main_el).find(`[${this.parent.prop.data_attr}='${this.attr_names.product_price}']`).text(this.item.price);
		$(this.main_el).find(`[${this.parent.prop.data_attr}='${this.attr_names.order_cart}']`).on("click", (e) => {
			e.preventDefault();
			let el = e.target;
			this.addToCart(el);
		});


		$(this.main_el).find(`[${this.parent.prop.data_attr}='${this.attr_names.soc_networks}']`).on("click", (e) => {
			e.preventDefault();
			let el = e.target;
			this.openSocNetwork(el);
		});
		$(this.main_el).find(`[${this.parent.prop.data_attr}='${this.attr_names.add_cart}']`).on("click", (e) => {
			e.preventDefault();
			let el = e.target;
			this.addToCart(el);
		});
		$(this.main_el).find(`[${this.parent.prop.data_attr}='${this.attr_names.like_btn}']`).on("click", (e) => {
			e.preventDefault();
			let el = e.target;
			this.performLike(el);
		});
		if(this.item.liked) $(this.main_el).find(`[${this.parent.prop.data_attr}='${this.attr_names.like_btn}']`).addClass(this.parent.prop.active_class);



		let noempty_sizes = {
			s: false,
			m: false,
			l: false,
			xl: false
		};
		this.size_el = {};

		for(let i = 0; i < this.item.qty.length; i++) {
			if(this.item.qty[i].name == "any") {
				this.any_color = true;
				this.color = "any";

				if(this.item.qty[i].sizes.any) {
					this.any_size = true;
					this.size = "any";
					this.size_el = null;
					this.max_qty = this.item.qty[i].sizes.any;
					break;
				} else {
					for(let key in this.item.qty[i].sizes) {
						let size = Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, key).value;
						if(size && size > 0) {
							Object.defineProperty(noempty_sizes, key, {value: true});
							if(!this.size) {
								this.size = key;
								this.max_qty = size;
							}
						}
					}
				}
				break;
			} else {
				let color = this.item.qty[i];
				let contain_size: boolean = false;
				if(this.item.qty[i].sizes.any) {
					this.any_size = true;
					this.size = "any";
					this.size_el = null;
					if(!this.max_qty) this.max_qty = this.item.qty[i].sizes.any;
				} else {
					for(let key in color.sizes) {
						let size = Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, key).value;
						if(size && size > 0) {
							Object.defineProperty(noempty_sizes, key, {value: true});
							contain_size = true;
							if(!this.size) {
								this.size = key;
								this.max_qty = size;
							}
						}
					}
				}
				if(contain_size) {
					color.el = null;
					if(!this.color) this.color = color.name;
				}
			}
		}
		if(this.any_size) $(this.main_el).find(`[${this.parent.prop.data_attr}='${this.attr_names.product_sizing}']`).remove();
		else {
			for(let key in noempty_sizes) {
				if(Object.getOwnPropertyDescriptor(noempty_sizes, key).value) {
					let el = $(this.main_el).find(`[${this.parent.prop.data_attr}='${Object.getOwnPropertyDescriptor(this.attr_names.product_sizes, key).value}'] button`);
					el.on("click", (e) => {
						e.preventDefault();
						let el = e.target;
						this.chooseSize(el);
					});
					Object.defineProperty(this.size_el, key, {
						value: el,
						configurable: true,
						enumerable: true,
						writable: true
					});
				} else {
					$(this.main_el).find(`[${this.parent.prop.data_attr}='${Object.getOwnPropertyDescriptor(this.attr_names.product_sizes, key).value}']`).remove();
				}
			}
		}

		$(this.main_el).find(`[${this.attr_names.counter_data_attr}='${this.attr_names.counter_plus}']`).on("click", (e) => {
			e.preventDefault();
			let el = e.target;
			this.changeQty(el, true);
		});
		$(this.main_el).find(`[${this.attr_names.counter_data_attr}='${this.attr_names.counter_minus}']`).on("click", (e) => {
			e.preventDefault();
			let el = e.target;
			this.changeQty(el, false);
		});
		$(this.main_el).find(`[${this.attr_names.counter_data_attr}='${this.attr_names.counter_res}']`).text("1");



		if(this.item.photos && this.item.photos.length) {
			let slide_html = $(`#${this.attr_names.gallery_id}`).find(`[${this.parent.prop.data_attr}='${this.attr_names.gallery_item}']`).clone();
			let nav_html = $(`#${this.attr_names.gallery_nav_id}`).find(`[${this.parent.prop.data_attr}='${this.attr_names.gallery_nav}']`).clone();

			$(`#${this.attr_names.gallery_id}`).find(`[${this.parent.prop.data_attr}='${this.attr_names.gallery_item_img}']`).attr("src", this.item.main_photo);
			$(`#${this.attr_names.gallery_nav_id}`).find(`[${this.parent.prop.data_attr}='${this.attr_names.gallery_nav_img}']`).attr("src", this.item.main_photo);

			for(let i = 0; i < this.item.photos.length; i++) {
				let src = this.item.photos[i];
				let new_slide_item = $(slide_html).clone();
				let new_nav_item = $(nav_html).clone();
				$(new_slide_item).appendTo(`#${this.attr_names.gallery_id}`).find(`[${this.parent.prop.data_attr}='${this.attr_names.gallery_item_img}']`).attr("src", src);
				$(new_nav_item).appendTo(`#${this.attr_names.gallery_nav_id}`).find(`[${this.parent.prop.data_attr}='${this.attr_names.gallery_nav_img}']`).attr("src", src);
			}

			productSlider();
		} else {
			$(`#${this.attr_names.gallery_id}`).find(`[${this.parent.prop.data_attr}='${this.attr_names.gallery_item_img}']`).attr("src", this.item.main_photo);
			$(`#${this.attr_names.gallery_nav_id}`).find(`[${this.parent.prop.data_attr}='${this.attr_names.gallery_nav}']`).remove();
		}


		this.qty = 1;
	}

	performLike(el: HTMLElement): void {
		if(!el.classList.contains(this.attr_names.like_disabled_class)) {
			if(this.item.liked) {
				this.item.liked = false;
				el.classList.add(this.attr_names.like_active_class);

			} else {
				this.item.liked = true;
				el.classList.remove(this.attr_names.like_active_class);
			}
			let action = null;
			if(this.item.liked) action = this.attr_names.add_like_action;
			else action = this.attr_names.del_like_action;
			Request_._post({
				action: action,
				data: {
					id: this.item._id,
					types: this.item.types
				},
				callbacks: {
					success: () => {
						if(this.item.liked) $(this.main_el).find(`[${this.parent.prop.data_attr}='${this.attr_names.like_btn}']`).addClass(this.parent.prop.active_class);
						else $(this.main_el).find(`[${this.parent.prop.data_attr}='${this.attr_names.like_btn}']`).removeClass(this.parent.prop.active_class);
					}
				}
			});
		} else {
			performTooltip(el, "Login for like!");
		}
	}
	openSocNetwork(el: HTMLElement): void {
		if(this.item.soc_networks && this.item.soc_networks.length) {
			let soc_buttons = $(`[${this.attr_names.share_popup_attr}='${this.attr_names.share_popup_name}']`).find(`a[${this.parent.prop.data_attr}]`);
			for(let i = 0; i < soc_buttons.length; i++) {
				$(soc_buttons).addClass(this.parent.prop.hidden_class);
			}
			for(let i = 0; i < this.item.soc_networks.length; i++) {
				let attr_nm = Object.getOwnPropertyDescriptor(this.attr_names, "attr_name_" + this.item.soc_networks[i].title);
				let attr_name: string = null;
				if(attr_nm) attr_name = attr_nm.value;
				let soc_el = $(`[${this.attr_names.share_popup_attr}='${this.attr_names.share_popup_name}']`).find(`[${this.parent.prop.data_attr}='${attr_name}']`);
				if(soc_el) {
					soc_el[0].classList.remove(this.parent.prop.hidden_class);
					if(this.item.soc_networks[i].class_name) soc_el[0].classList.add(this.item.soc_networks[i].class_name);
					$(soc_el).attr("href", this.item.soc_networks[i].link);
				}
			}
			Popup.open(this.attr_names.share_popup_name);
		} else performTooltip(el, "There are no socnetworks");
	}
	addToCart(el: HTMLElement): void {

		let prod: cart_product = {
			_id: this.item._id,
			id: this.item.id,
			name: this.item.name,
			describe: this.item.describe,
			main_photo: this.item.main_photo,
			price: this.item.price,
			category_name: this.item.category_name,
			types: this.item.types,
			color: this.color,
			size: this.size,
			qty: this.qty,
			max_qty: this.max_qty,
			total_price: this.item.price * this.qty
		};
		if(Cart.addToCart(prod)) {
			if(el.getAttribute(this.parent.prop.data_attr) == this.attr_names.add_cart) el.classList.add(this.attr_names.cart_animation_class);
			this.restoreInitEl();
		}
		else performTooltip(el, "Already in the cart");
	}
	chooseSize(el: HTMLElement): void {
		let size = el.innerText.toLowerCase();

		this.size = size;
		el.classList.add(this.parent.prop.active_class);

		for(let i = 0; i < this.item.qty.length; i++) {
			if(this.any_color) {
				if(this.item.qty[i].name == "any") {
					this.max_qty = Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, size).value;
				}
			} else {
				let descriptor = Object.getOwnPropertyDescriptor(this.item.qty[i].sizes, size);
				if(descriptor && descriptor.value > 0) {
					this.color = this.item.qty[i].name;
					this.max_qty = descriptor.value;
				}
			}
		}
		if(this.qty > this.max_qty) {
			this.qty = this.max_qty;
			$(this.main_el).find(`[${this.attr_names.counter_data_attr}='${this.attr_names.counter_res}']`).text(this.qty);
		}
		for(let key in this.size_el) {
			let element = Object.getOwnPropertyDescriptor(this.size_el, key).value;
			if(key != size) $(element).removeClass(this.parent.prop.active_class);
		}
	}
	changeQty(target: HTMLElement, up: boolean): void {
		let qty: number;
		if(up) {
			if(this.qty === this.max_qty) {
				performTooltip(target, "No more quantity in the shop");
				return;
			}
			else qty = ++this.qty;
		}
		else {
			if(this.qty === 1) {
				performTooltip(target, "It is minimum quantity");
				return;
			}
			else qty = --this.qty;
		}
		$(this.main_el).find(`[${this.attr_names.counter_data_attr}='${this.attr_names.counter_res}']`).text(qty);
	}
	restoreInitEl(): void {
		this.qty = 1;
		$(this.main_el).find(`[${this.attr_names.counter_data_attr}='${this.attr_names.counter_res}']`).text(this.qty);

		if(this.size_el && Object.keys(this.size_el).length) {
			for(let key in this.size_el) {
				let element = Object.getOwnPropertyDescriptor(this.size_el, key).value;
				$(element).removeClass(this.parent.prop.active_class);
			}
		}
	}
}
export interface attr_names_single_item {
	product_name: string;
	product_subtitle: string;
	product_describe: string;
	product_price: string;
	product_sizing: string;
	product_sizes: {
		s: string;
		m: string;
		l: string;
		xl: string;
	},
	empty_qty_class: string;
	order_cart: string;
	soc_networks: string;
	add_cart: string;
	cart_animation_class: string;
	like_btn: string;
	like_active_class: string;
	like_disabled_class: string;
	add_like_action: string;
	del_like_action: string;

	share_popup_name: string;
	share_popup_attr: string;
	attr_name_Facebook: string;
	attr_name_Twitter: string;
	attr_name_Google: string;
	attr_name_Instagram: string;

	counter: string;
	counter_data_attr: string;
	counter_plus: string;
	counter_minus: string;
	counter_res: string;

	gallery_id: string;
	gallery_nav_id: string;
	gallery_item: string;
	gallery_item_img: string;
	gallery_nav: string;
	gallery_nav_img: string;
}
const ATTR_names_single_item: attr_names_single_item = {
	product_name: "product_name",
	product_subtitle: "product_subtitle",
	product_describe: "product_describe",
	product_price: "product_price",
	product_sizing: "product_sizing",
	product_sizes: {
		s: "product_size_s",
		m: "product_size_m",
		l: "product_size_l",
		xl: "product_size_xl"
	},
	empty_qty_class: "empty",
	order_cart: "product_ordercart",
	soc_networks: "product_network",
	add_cart: "product_tocart",
	cart_animation_class: "add-cart-animation",
	like_btn: "product_like",
	like_active_class: "active",
	like_disabled_class: "disabled",
	add_like_action: "/addlike",
	del_like_action: "/dellike",

	share_popup_name: "share_product",
	share_popup_attr: "data-popup-targ",
	attr_name_Facebook: "social_facebook",
	attr_name_Twitter: "social_twitter",
	attr_name_Google: "social_google",
	attr_name_Instagram: "social_instagram",

	counter: "counter",
	counter_data_attr: "data-count-qty",
	counter_plus: "product_plus_qty",
	counter_minus: "product_minus_qty",
	counter_res: "product_target_qty",

	gallery_id: "product_gallery",
	gallery_nav_id: "product_gallery_nav",
	gallery_item: "prod_gallery_item",
	gallery_item_img: "prod_gallery_item_img",
	gallery_nav: "prod_gallery_nav",
	gallery_nav_img: "prod_gallery_nav_img"
};




/* main class */
interface main_prop {
	data_attr: string;
	hidden_class: string;
	active_class: string;

	block_el: HTMLElement;
	container_el?: HTMLElement;
	block_type: "big item" | "little item" | "single item";
	max_item?: number;
	categories?: string;

	loadmore_btn?: HTMLElement;
	loadmore_block?: HTMLElement;
	page_step?: number;

	request_action?: string;
}

export class Products_ {
	prop: main_prop;
	products: (singleItem | littleItem | bigItem)[];
	data_attr_names: attr_names_single_item | attr_names_little_item | attr_names_big_item;
	html_el?: JQuery<HTMLElement>;
	related_prop?: pr_prop;
	page?: number;


	constructor(prop: pr_prop, related?: pr_prop, attr_names?: attr_names_single_item | attr_names_little_item | attr_names_big_item, prod?: intro_product) {
		this.products = [];
		this.prop = {
			data_attr: prop.data_attr || "data-in",

			block_el: $(prop.block_selector)[0],
			block_type: prop.block_type,
			hidden_class: prop.hidden_class || "hidden",
			active_class: prop.active_class || "active"
		};
		if(prop.request_action) this.prop.request_action = prop.request_action;
		if(prop.block_type != "single item") this.prop.container_el = $(prop.block_selector).find(`[${prop.data_attr || "data-in"}='${prop.container_attr_name}']`)[0];
		if(related) this.related_prop = related;


		if(prop.max_item) this.prop.max_item = prop.max_item;
		if(prop.loadmore_btn_id) {
			this.prop.loadmore_btn = document.getElementById(prop.loadmore_btn_id);
			prop.loadmore_block_attr_name = prop.loadmore_block_attr_name || "load_more_block";
			this.prop.loadmore_block = $(this.prop.block_el).find(`[${this.prop.data_attr}='${prop.loadmore_block_attr_name}']`)[0];
			this.prop.loadmore_btn.addEventListener("click", (e) => {
				e.preventDefault();
				this.loadMoreElements();
			});
			this.prop.page_step = prop.page_step || 1;
		}

		if(attr_names) this.data_attr_names = attr_names;
		else {
			let attr_names: attr_names_single_item | attr_names_little_item | attr_names_big_item;
			if(this.prop.block_type == "big item") attr_names = ATTR_names_big_item;
			if(this.prop.block_type == "little item") attr_names = ATTR_names_little_item;
			if(this.prop.block_type == "single item") attr_names = ATTR_names_single_item;
			this.data_attr_names = attr_names;
		}

		if(this.prop.block_type != "single item") {
			this.html_el = $(this.prop.container_el).children().first().clone();
			$(this.prop.container_el).empty();
		}

		if(!prod) this.downloadElements();
		else this.downloadElements(null, prod);
		if(prop.categories) this.addCategory();
	}



	private compileElement(elements: intro_product[]): void {
		if(elements.length) {
			let child_costructor = null;
			if(this.prop.block_type == "big item") child_costructor = bigItem;
			else if(this.prop.block_type == "little item") child_costructor = littleItem;
			else if(this.prop.block_type == "single item") child_costructor = singleItem;

			for(let i = 0; i < elements.length; i++) {
				this.products[this.products.length] = new child_costructor(elements[i], this);
			}
		}
	}


	private downloadElements(more?: boolean, prod?: intro_product): void {
		let action: string = this.prop.request_action;
		let req_arguments: string = "";
		if(this.prop.loadmore_btn) {
			this.page = this.page || 1;
			req_arguments += `page=${this.page}&`;
		}
		if(this.prop.categories) req_arguments += this.prop.categories;
		if(req_arguments) action += ("?" + req_arguments);

		let callback = (data: any) => {
			if(data) {
				if(data instanceof Array) {
					if(!more) {
						this.products = [];
						$(this.prop.container_el).empty();
					}
					if(this.prop.loadmore_btn && data.length && data.length >= this.prop.page_step) $(this.prop.loadmore_block).removeClass(this.prop.hidden_class);
					else if(this.prop.loadmore_btn) $(this.prop.loadmore_block).addClass(this.prop.hidden_class);

					if(this.prop.max_item) {
						data.splice(this.prop.max_item);
					}
					if(logged_user && logged_user.liked_prod && logged_user.liked_prod.length) {
						for(let i = 0; i < data.length; i++) {
							for(let j = 0; j < logged_user.liked_prod; j++) {
								if(data[i]._id == logged_user.liked_prod[j]._id) data[i].liked = true;
								else data[i].liked = false;
							}
						}
					}
					if(this.related_prop && data[0].related_prod && data[0].related_prod.length) new Products_(this.related_prop, null, null, data[0].related_prod);
					else if(this.related_prop) {
						$(this.related_prop.block_selector).remove();
					}

				}

				this.compileElement(data);
			}
		};
		if(prod) callback(prod);
		let prop: getReqObj = {
			action: action,
			responsType: "json",
			callbacks: {
				success: callback
			}
		};
		if(!prod) Request_._get(prop);
	}


	loadMoreElements(): void {
		this.page++;
		this.downloadElements(true);
	}


	private addCategory(): void {
		let interval_id: number;
		interval_id = window.setInterval(() => {
			if(categories) {
				Product_selecotr.setGetterFc((ctgr: categories_) => {
					this.changeCategory(ctgr);
				});

				window.clearInterval(interval_id);
			}
		}, 2000);
	}


	changeCategory(ctgr: categories_): void {
		let request: string = "ctgr=true&";
		for(let key in ctgr) {
			if(key == "price_filter") {
				request += `top_val=${ctgr[key].top_val}&`;
				request += `bottom_val=${ctgr[key].bottom_val}&`;
			} else {
				for(let i = 0; i < ctgr[key].items.length; i++) {
					request += `${key}=${ctgr[key].items[i].name}&`;
				}
			}
		}
		this.prop.categories = request;
		this.page = 1;

		this.downloadElements();
	}
}