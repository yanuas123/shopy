/* module Satte Tasker ------------------------------------------------------ */

/* This module is appropriate to perform any actions (changing styles, executing functions or define event functions)
 * on an element or group of elements and defined depends elements depending on the state of leading element.
 * Main class - StateTasker
 * Properties for executing this module are described below. */

// types
export type st_class_type = string | string[];
export type st_state_type = string | string[];
export type st_functions_type = Function | Function[];

// type for the property type
export type st_el_types = "el" | "inp" | "inp2" // inp2 - it is checkbox | readio | select
// el - st_dom_El_type, inp - st_dom_inp_type, inp2 - st_dom_inp2_type

// DOM element types
export type st_dom_El_type = HTMLElement | HTMLElement[];
export type st_dom_inp_type = HTMLInputElement | HTMLTextAreaElement | (HTMLInputElement | HTMLTextAreaElement)[];
export type st_dom_inp2_type = HTMLInputElement | HTMLSelectElement | (HTMLInputElement | HTMLSelectElement)[];
export type st_dom_types = st_dom_El_type | st_dom_inp_type | st_dom_inp2_type;


// css class object for concrete state
export interface st_state_class_obj {
	state: string;
	class: st_class_type;
}
export type st_state_class_type = st_state_class_obj[];
// function object for concrete state
export interface st_state_functions_obj {
	state: string;
	func: st_functions_type;
}
export type st_state_functions_type = st_state_functions_obj[];
// objects of event handlers
export interface st_Func_event {
	click?: st_functions_type;
	hover?: st_functions_type;
	focus?: st_functions_type;
	change?: st_functions_type;
}
export interface st_Func_st_event {
	click?: st_state_functions_type;
	hover?: st_state_functions_type;
	focus?: st_state_functions_type;
	change?: st_state_functions_type;
}


/* properties and arguments */

export interface st_prop { // main properties argument
	readonly id_data_attr: string;
}
const PROP: st_prop = { // default main properties
	id_data_attr: "data-st-id"
};

// properties for single element or group of elements
export interface st_single_element {
	selector?: string; // Add query selector for getting elements using it. If you defined 'id' omit it.
	el?: st_dom_types; // you must necessarily define the 'el' or 'selector' properties
	type?: st_el_types; // Default type is 'el'. If you want to change it define type.

	style_active?: st_class_type; // css class for active state
	style_noactive?: st_class_type; // css class for not active state
	func_active?: st_functions_type; // function that execute when activate instance
	func_noactive?: st_functions_type; // function that execute when deactivate instance

	style_state?: st_state_class_type;
	func_state?: st_state_functions_type; // function that execute when add state

	// there uses three functions templates for events depends on the type of element
	// use template that relative to the type of element
	f_events_active?: st_Func_event;
	f_events_noactive?: st_Func_event;
	f_events_state?: st_Func_st_event;
}
// additional properties for leading element or group of elements
export interface st_elInstanceProp extends st_single_element { // leading element extends properties of single element
	// this id uses for connecting and after leading the element
	// if you want to perform any method from main class for an instance use this id
	// also you can get this id from attribute on an leading element. This attribute defined in main properties
	id?: string;
	active_state?: boolean; // start active state
	state?: st_state_type; // start custom states

	// you can use depends elements which have connection with states in leading element
	// use single element instance for define single element or group of elements in this array
	depend_elements?: st_single_element[];
}

// main class properties of methods
interface mainMethods {
	setNewElement(prop: st_elInstanceProp): string; // it defines new element instance
	activeState(el: string | st_dom_types, val: boolean): void; // it makes active state of element false or true
	addState(el: string | st_dom_types, val: st_state_type): void; // add new state or group of states
	delState(el: string | st_dom_types, val: st_state_type): void;
	changeState(el: string | st_dom_types, old_s: st_state_type, new_s: st_state_type): void; // changes states without executing start functions. It executes only event functions and styles
}

/* end Properties and arguments */







// secondary methods of class
abstract class secondaryMethods {
	addStringToProp(s1: string | string[], s2: string | string[]): string | string[] {
		let new_el: string | string[];
		if(s1 && typeof s1 == "string") new_el = [s1];
		else if(s1 && s1 instanceof Array) new_el = s1;
		else new_el = [];
		new_el.concat(s2);
		return new_el;
	}
	delStringFromProp(s1: string | string[], s2: string | string[]): string | string[] {
		let new_el: string | string[];
		if(s1 && typeof s1 == "string") new_el = undefined;
		else if(s1 && s1 instanceof Array) {
			new_el = [];
			for(let i = 0; i < s1.length; i++) {
				let str = s1[i];
				if(typeof s2 == "string" && (s2 != str)) new_el.push(str);
				else if(s2 instanceof Array) {
					let found = false;
					for(let j = 0; j < s2.length; j++) {
						if(str == s2[j]) {
							found = true;
							break;
						};
					}
					if(!found) new_el.push(str);
				}
			}
			if(new_el.length === 1) new_el = new_el[0];
			else if(!new_el.length) new_el = undefined;
		}
		else new_el = undefined;
		return new_el;
	}
	connectClassAr(el: st_dom_types, cl: st_class_type): void {
		if(typeof el == "string") {
			if(typeof cl == "string") {
				(<HTMLElement> el).classList.add(cl);
			} else if(cl instanceof Array) {
				for(let i = 0; i < cl.length; i++) {
					(<HTMLElement> el).classList.add(cl[i]);
				}
			}
		} else if(el instanceof Array) {
			for(let j = 0; j < el.length; j++) {
				if(typeof cl == "string") {
					el[j].classList.add(cl);
				} else if(cl instanceof Array) {
					for(let i = 0; i < cl.length; i++) {
						el[i].classList.add(cl[i]);
					}
				}
			}
		}
	}
	disconnectClassAr(el: st_dom_types, cl: st_class_type): void {
		if(typeof el == "string") {
			if(typeof cl == "string") {
				(<HTMLElement> el).classList.remove(cl);
			} else if(cl instanceof Array) {
				for(let i = 0; i < cl.length; i++) {
					(<HTMLElement> el).classList.remove(cl[i]);
				}
			}
		} else if(el instanceof Array) {
			for(let j = 0; j < el.length; j++) {
				if(typeof cl == "string") {
					el[j].classList.remove(cl);
				} else if(cl instanceof Array) {
					for(let i = 0; i < cl.length; i++) {
						el[i].classList.remove(cl[i]);
					}
				}
			}
		}
	}
	connectFuncAr(cur: st_functions_type, f: st_functions_type): st_functions_type {
		let new_cur: st_functions_type;
		if(cur && cur instanceof Function) new_cur = [cur];
		else if(cur && cur instanceof Array) new_cur = cur;
		else new_cur = [];
		new_cur.concat(f);
		return new_cur;
	}
	performFuncArray(f: st_functions_type): void {
		if(f) {
			if(f instanceof Function) f();
			else if(f instanceof Array) {
				for(let i = 0; i < f.length; i++) {
					f[i]();
				}
			}
		}
	}
	searchElements(q: string, t?: st_el_types): st_dom_types {
		let elements = document.querySelectorAll(q);
		let el_res: HTMLElement | HTMLElement[];
		if(elements.length && elements.length === 1) {
			el_res = <st_dom_types> elements[0];
		} else if(elements.length) {
			el_res = [];
			for(let i = 0; i < elements.length; i++) {
				if(t && t == "inp") {
					if(elements[i].tagName == "HTMLInputElement") el_res.push(<HTMLInputElement> elements[i]);
					if(elements[i].tagName == "HTMLTextAreaElement") el_res.push(<HTMLTextAreaElement> elements[i]);
				} else if(t && t == "inp2") {
					if((elements[i].tagName == "HTMLInputElement") && ((<HTMLInputElement> elements[i]).type == "checkbox" || (<HTMLInputElement> elements[i]).type == "radio")) el_res.push(<HTMLInputElement> elements[i]);
					if(elements[i].tagName == "HTMLSelectElement") el_res.push(<HTMLSelectElement> elements[i]);
				} else {
					el_res.push(<HTMLElement> elements[i]);
				}
			}
		} else console.error("Element for the query '", q, "' was not found!");
		if(elements && (!el_res || (Array.isArray(el_res) && !el_res.length))) console.error("Elements for the query '", q, "' has invalid type!");
		return el_res;
	}
}

// constantly properties of instances
interface elStaticProps {
	readonly el: st_dom_types;
	style_active?: st_class_type;
	style_noactive?: st_class_type;
	func_active?: st_functions_type;
	func_noactive?: st_functions_type;

	style_state?: st_state_class_type;
	func_state?: st_state_functions_type;

	setStyleActive(): void;
	delStyleActive(): void;
	setStyleNoactive(): void;
	delStyleNoactive(): void;
	execFuncActive(): void;
	execFuncNoactive(): void;

	setStyleState(state: st_state_type): void;
	delStyleState(state: st_state_type): void;
	execFuncState(state: st_state_type): void;
}
abstract class create_elStatic extends secondaryMethods implements elStaticProps {
	el: st_dom_types;
	style_active?: st_class_type;
	style_noactive?: st_class_type;
	func_active?: st_functions_type;
	func_noactive?: st_functions_type;

	style_state?: st_state_class_type;
	func_state?: st_state_functions_type;

	constructor(prop: st_elInstanceProp) {
		super();

		this.el = prop.el;
		if(prop.style_active) this.style_active = prop.style_active;
		if(prop.style_noactive) this.style_noactive = prop.style_noactive;
		if(prop.func_active) this.func_active = prop.func_active;
		if(prop.func_noactive) this.func_noactive = prop.func_noactive;
		if(prop.style_state) this.style_state = prop.style_state;
		if(prop.func_state) this.func_state = prop.func_state;
	}

	setStyleActive(): void {
		if(this.style_active) this.connectClassAr(this.el, this.style_active);
	}
	delStyleActive(): void {
		if(this.style_active) this.disconnectClassAr(this.el, this.style_active);
	}
	setStyleNoactive(): void {
		if(this.style_noactive) this.connectClassAr(this.el, this.style_noactive);
	}
	delStyleNoactive(): void {
		if(this.style_noactive) this.disconnectClassAr(this.el, this.style_noactive);
	}
	execFuncActive(): void {
		if(this.func_active) this.performFuncArray(this.func_active);
	}
	execFuncNoactive(): void {
		if(this.func_noactive) this.performFuncArray(this.func_noactive);
	}

	setStyleState(state: st_state_type): void {
		if(this.style_state) {
			for(let i = 0; i < this.style_state.length; i++) {
				if(typeof state == "string" && state == this.style_state[i].state) this.connectClassAr(this.el, this.style_state[i].class);
				else if(state instanceof Array) {
					for(let j = 0; j < state.length; j++) {
						if(state[j] == this.style_state[i].state) this.connectClassAr(this.el, this.style_state[i].class);
					}
				}
			}
		}
	}
	delStyleState(state: st_state_type): void {
		if(this.style_state) {
			for(let i = 0; i < this.style_state.length; i++) {
				if(typeof state == "string" && state == this.style_state[i].state) this.disconnectClassAr(this.el, this.style_state[i].class);
				else if(state instanceof Array) {
					for(let j = 0; j < state.length; j++) {
						if(state[j] == this.style_state[i].state) this.disconnectClassAr(this.el, this.style_state[i].class);
					}
				}
			}
		}
	}
	execFuncState(state: st_state_type): void {
		if(this.func_state) {
			for(let i = 0; i < this.func_state.length; i++) {
				if(typeof state == "string" && state == this.func_state[i].state) this.performFuncArray(this.func_state[i].func);
				else if(state instanceof Array) {
					for(let j = 0; j < state.length; j++) {
						if(state[j] == this.func_state[i].state) this.performFuncArray(this.func_state[i].func);
					}
				}
			}
		}
	}
}

// element instances
interface elProps {
	readonly type: st_el_types;
	f_events_active: st_Func_event;
	f_events_noactive: st_Func_event;

	f_events_state: st_Func_st_event;

	f_events_current: st_Func_event;

	setFEventsActive(): void;
	setFEventsNoactive(): void;
	setFEventsState(state: st_state_type): void;
	cleanUpEvents(): void;
	setEvents(): void;
}

class instance_el extends create_elStatic implements elProps {
	type: st_el_types;
	f_events_active: st_Func_event;
	f_events_noactive: st_Func_event;

	f_events_state: st_Func_st_event;

	f_events_current: st_Func_event;

	constructor(prop: st_elInstanceProp) {
		super(prop);

		this.type = prop.type;
		if(prop.f_events_active) this.f_events_active = {
			click: prop.f_events_active.click || null
		};
		if(this.type == "el" || this.type == "inp") this.f_events_active.hover = (<st_Func_event> prop.f_events_active).hover || null;
		if(this.type == "inp" || this.type == "inp2") this.f_events_active.change = (<st_Func_event> prop.f_events_active).change || null;
		if(this.type == "inp") this.f_events_active.focus = (<st_Func_event> prop.f_events_active).focus || null;

		if(prop.f_events_noactive) this.f_events_noactive = {
			click: prop.f_events_noactive.click || null
		};
		if(this.type == "el" || this.type == "inp") this.f_events_noactive.hover = (<st_Func_event> prop.f_events_noactive).hover || null;
		if(this.type == "inp" || this.type == "inp2") this.f_events_noactive.change = (<st_Func_event> prop.f_events_noactive).change || null;
		if(this.type == "inp") this.f_events_noactive.focus = (<st_Func_event> prop.f_events_noactive).focus || null;

		if(prop.f_events_state) this.f_events_state = {
			click: prop.f_events_state.click || null
		};
		if(this.type == "el" || this.type == "inp") this.f_events_state.hover = (<st_Func_st_event> prop.f_events_state).hover || null;
		if(this.type == "inp" || this.type == "inp2") this.f_events_state.change = (<st_Func_st_event> prop.f_events_state).change || null;
		if(this.type == "inp") this.f_events_state.focus = (<st_Func_st_event> prop.f_events_state).focus || null;

		this.f_events_current = {};
		if(!this.f_events_active.click || !this.f_events_noactive.click || !this.f_events_state.click) this.f_events_current.click = null;
		if(!this.f_events_active.hover || !this.f_events_noactive.hover || !this.f_events_state.hover) this.f_events_current.hover = null;
		if(!this.f_events_active.change || !this.f_events_noactive.change || !this.f_events_state.change) this.f_events_current.change = null;
		if(!this.f_events_active.focus || !this.f_events_noactive.focus || !this.f_events_state.focus) this.f_events_current.focus = null;
	}

	setFEventsActive(): void {
		if(this.f_events_active.click) this.connectFuncAr(this.f_events_current.click, this.f_events_active.click);
		if(this.f_events_active.hover) this.connectFuncAr(this.f_events_current.hover, this.f_events_active.hover);
		if(this.f_events_active.change) this.connectFuncAr(this.f_events_current.change, this.f_events_active.change);
		if(this.f_events_active.focus) this.connectFuncAr(this.f_events_current.focus, this.f_events_active.focus);
	}
	setFEventsNoactive(): void {
		if(this.f_events_noactive.click) this.connectFuncAr(this.f_events_current.click, this.f_events_noactive.click);
		if(this.f_events_noactive.hover) this.connectFuncAr(this.f_events_current.hover, this.f_events_noactive.hover);
		if(this.f_events_noactive.change) this.connectFuncAr(this.f_events_current.change, this.f_events_noactive.change);
		if(this.f_events_noactive.focus) this.connectFuncAr(this.f_events_current.focus, this.f_events_noactive.focus);
	}
	setFEventsState(state: st_state_type): void {
		if(this.f_events_state.click) {
			for(let i = 0; i < this.f_events_state.click.length; i++) {
				if(typeof state == "string" && state == this.f_events_state.click[i].state) this.connectFuncAr(this.f_events_current.click, this.f_events_state.click[i].func);
				else if(state instanceof Array) {
					for(let j = 0; j < state.length; j++) {
						if(state[j] == this.f_events_state.click[i].state) this.connectFuncAr(this.f_events_current.click, this.f_events_state.click[i].func);
					}
				}
			}
		}
		if(this.f_events_state.hover) {
			for(let i = 0; i < this.f_events_state.hover.length; i++) {
				if(typeof state == "string" && state == this.f_events_state.hover[i].state) this.connectFuncAr(this.f_events_current.hover, this.f_events_state.hover[i].func);
				else if(state instanceof Array) {
					for(let j = 0; j < state.length; j++) {
						if(state[j] == this.f_events_state.hover[i].state) this.connectFuncAr(this.f_events_current.hover, this.f_events_state.hover[i].func);
					}
				}
			}
		}
		if(this.f_events_state.change) {
			for(let i = 0; i < this.f_events_state.change.length; i++) {
				if(typeof state == "string" && state == this.f_events_state.change[i].state) this.connectFuncAr(this.f_events_current.change, this.f_events_state.change[i].func);
				else if(state instanceof Array) {
					for(let j = 0; j < state.length; j++) {
						if(state[j] == this.f_events_state.change[i].state) this.connectFuncAr(this.f_events_current.change, this.f_events_state.change[i].func);
					}
				}
			}
		}
		if(this.f_events_state.focus) {
			for(let i = 0; i < this.f_events_state.focus.length; i++) {
				if(typeof state == "string" && state == this.f_events_state.focus[i].state) this.connectFuncAr(this.f_events_current.focus, this.f_events_state.focus[i].func);
				else if(state instanceof Array) {
					for(let j = 0; j < state.length; j++) {
						if(state[j] == this.f_events_state.focus[i].state) this.connectFuncAr(this.f_events_current.focus, this.f_events_state.focus[i].func);
					}
				}
			}
		}
	}
	cleanUpEvents(): void {
		if(this.f_events_current.click) this.f_events_current.click = undefined;
		if(this.f_events_current.hover) this.f_events_current.hover = undefined;
		if(this.f_events_current.focus) this.f_events_current.focus = undefined;
		if(this.f_events_current.change) this.f_events_current.change = undefined;
	}
	setEvents(): void {
		if(this.el instanceof Array) {
			for(let j = 0; j < this.el.length; j++) {
				if(this.f_events_current.click !== null) {
					this.el[j].addEventListener("click", (e: Event) => {
						if(this.f_events_current.click instanceof Function) this.f_events_current.click();
						else if(this.f_events_current.click instanceof Array) {
							for(let i = 0; i < this.f_events_current.click.length; i++) {
								this.f_events_current.click[i]();
							}
						}
					});
				}
				if(this.f_events_current.hover !== null) {
					this.el[j].addEventListener("mouseenter", (e: Event) => {
						if(this.f_events_current.hover instanceof Function) this.f_events_current.hover();
						else if(this.f_events_current.hover instanceof Array) {
							for(let i = 0; i < this.f_events_current.hover.length; i++) {
								this.f_events_current.hover[i]();
							}
						}
					});
				}
				if(this.f_events_current.change !== null) {
					this.el[j].addEventListener("mouseenter", (e: Event) => {
						if(this.f_events_current.change instanceof Function) this.f_events_current.change();
						else if(this.f_events_current.change instanceof Array) {
							for(let i = 0; i < this.f_events_current.change.length; i++) {
								this.f_events_current.change[i]();
							}
						}
					});
				}
				if(this.f_events_current.focus !== null) {
					this.el[j].addEventListener("mouseenter", (e: Event) => {
						if(this.f_events_current.focus instanceof Function) this.f_events_current.focus();
						else if(this.f_events_current.focus instanceof Array) {
							for(let i = 0; i < this.f_events_current.focus.length; i++) {
								this.f_events_current.focus[i]();
							}
						}
					});
				}
			}
		} else {
			if(this.f_events_current.click !== null) {
				this.el.addEventListener("click", (e: Event) => {
					if(this.f_events_current.click instanceof Function) this.f_events_current.click();
					else if(this.f_events_current.click instanceof Array) {
						for(let i = 0; i < this.f_events_current.click.length; i++) {
							this.f_events_current.click[i]();
						}
					}
				});
			}
			if(this.f_events_current.hover !== null) {
				this.el.addEventListener("mouseenter", (e: Event) => {
					if(this.f_events_current.hover instanceof Function) this.f_events_current.hover();
					else if(this.f_events_current.hover instanceof Array) {
						for(let i = 0; i < this.f_events_current.hover.length; i++) {
							this.f_events_current.hover[i]();
						}
					}
				});
			}
			if(this.f_events_current.change !== null) {
				this.el.addEventListener("mouseenter", (e: Event) => {
					if(this.f_events_current.change instanceof Function) this.f_events_current.change();
					else if(this.f_events_current.change instanceof Array) {
						for(let i = 0; i < this.f_events_current.change.length; i++) {
							this.f_events_current.change[i]();
						}
					}
				});
			}
			if(this.f_events_current.focus !== null) {
				this.el.addEventListener("mouseenter", (e: Event) => {
					if(this.f_events_current.focus instanceof Function) this.f_events_current.focus();
					else if(this.f_events_current.focus instanceof Array) {
						for(let i = 0; i < this.f_events_current.focus.length; i++) {
							this.f_events_current.focus[i]();
						}
					}
				});
			}
		}
	}
}


// lead elements instances
interface lead_elProp {
	readonly id: string;
	active?: boolean;
	state?: st_state_type;

	depends?: instance_el[];

	setActiveTrue(): void;
	setActiveFalse(): void;
	setState(state: st_state_type): void;
	delState(state: st_state_type): void;
	changeState(old_s: st_state_type, new_s: st_state_type): void;

	setDefault(): void;
}

class instanceLeadEl extends instance_el implements lead_elProp {
	id: string;
	active?: boolean;
	state?: st_state_type;

	depends?: instance_el[];

	constructor(prop: st_elInstanceProp) {
		super(prop);

		this.id = prop.id;
		if(prop.active_state) this.active = true;
		else this.active = false;
		if(prop.state) this.state = prop.state;

		if(prop.depend_elements) {
			this.depends = [];
			for(let i = 0; i < prop.depend_elements.length; i++) {
				let prop_depend_i = prop.depend_elements[i];
				if(!prop_depend_i.el) {
					if(prop_depend_i.selector) {
						prop_depend_i.el = this.searchElements(prop_depend_i.selector, prop_depend_i.type);
					}
					else console.error("Not defined depend element and selector!");
				}
				if(prop_depend_i.el) {
					if(prop_depend_i.el instanceof Array) {
						for(let j = 0; j < (<Array<HTMLElement>> this.depends[i].el).length; j++) {
							this.depends[j] = new instance_el(prop_depend_i);
						}
					} else {
						this.depends[0] = new instance_el(prop_depend_i);
					}
				}
			}
		}
	}

	setActiveTrue(): void {
		this.active = true;

		this.setStyleActive();
		this.execFuncActive();

		this.cleanUpEvents();
		this.setFEventsActive();
		this.setEvents();

		if(this.depends) {
			for(let i = 0; i < this.depends.length; i++) {
				this.depends[i].setStyleActive();
				this.depends[i].execFuncActive();

				this.depends[i].cleanUpEvents();
				this.depends[i].setFEventsActive();
				this.depends[i].setEvents();
			}
		}
	}
	setActiveFalse(): void {
		this.active = false;

		this.setStyleNoactive();
		this.execFuncNoactive();

		this.cleanUpEvents();
		this.setFEventsNoactive();
		this.setEvents();

		if(this.depends) {
			for(let i = 0; i < this.depends.length; i++) {
				this.depends[i].setStyleNoactive();
				this.depends[i].execFuncNoactive();

				this.depends[i].cleanUpEvents();
				this.depends[i].setFEventsNoactive();
				this.depends[i].setEvents();
			}
		}
	}
	setState(state: st_state_type): void {
		this.state = this.addStringToProp(this.state, state);

		this.setStyleState(state);
		this.execFuncState(state);

		this.cleanUpEvents();
		this.setFEventsState(this.state);
		this.setEvents();

		if(this.depends) {
			for(let i = 0; i < this.depends.length; i++) {
				this.depends[i].setStyleState(state);
				this.depends[i].execFuncState(state);

				this.depends[i].cleanUpEvents();
				this.depends[i].setFEventsState(this.state);
				this.depends[i].setEvents();
			}
		}
	}
	delState(state: st_state_type): void {
		this.state = this.delStringFromProp(this.state, state);

		this.delStyleState(state);

		this.cleanUpEvents();
		this.setFEventsState(this.state);
		this.setEvents();

		if(this.depends) {
			for(let i = 0; i < this.depends.length; i++) {
				this.depends[i].delStyleState(state);

				this.depends[i].cleanUpEvents();
				this.depends[i].setFEventsState(this.state);
				this.depends[i].setEvents();
			}
		}
	}
	changeState(old_s: st_state_type, new_s: st_state_type): void {
		this.state = this.delStringFromProp(this.state, old_s);
		this.state = this.addStringToProp(this.state, new_s);

		this.delStyleState(old_s);
		this.setStyleState(new_s);

		this.cleanUpEvents();
		this.setFEventsState(this.state);
		this.setEvents();

		if(this.depends) {
			for(let i = 0; i < this.depends.length; i++) {
				this.depends[i].delStyleState(old_s);
				this.depends[i].setStyleState(new_s);

				this.depends[i].cleanUpEvents();
				this.depends[i].setFEventsState(this.state);
				this.depends[i].setEvents();
			}
		}
	}

	setDefault(): void {
		this.cleanUpEvents();
		if(this.active) {
			this.setStyleActive();
			this.setFEventsActive();
		}
		if(!this.active) {
			this.setStyleNoactive();
			this.setFEventsNoactive();
		}
		if(this.state) {
			this.setStyleState(this.state);
			this.setFEventsState(this.state);
		}
		this.setEvents();

		if(this.depends) {
			for(let i = 0; i < this.depends.length; i++) {
				this.depends[i].cleanUpEvents();

				if(this.active) {
					this.depends[i].setStyleActive();
					this.depends[i].setFEventsActive();
				}
				if(!this.active) {
					this.depends[i].setStyleNoactive();
					this.depends[i].setFEventsNoactive();
				}
				if(this.state) {
					this.depends[i].setStyleState(this.state);
					this.depends[i].setFEventsState(this.state);
				}

				this.depends[i].setEvents();
			}
		}
	}
}




// main class

export class StateTasker extends secondaryMethods implements mainMethods {
	private elements: {
		[item: string]: instanceLeadEl | instanceLeadEl[];
	};
	readonly props: st_prop;

	constructor(prop: st_prop = PROP) {
		super();
		this.props = prop;
	}

	private addId(el: st_dom_types, id: string): void {
		if(el instanceof Array) {
			for(let i = 0; i < el.length; i++) {
				el[i].setAttribute(this.props.id_data_attr, id);
			}
		} else if(el instanceof HTMLElement) {
			el.setAttribute(this.props.id_data_attr, id);
		}
	}
	private createId(el: st_dom_types, str?: string): string {
		let str_ = str || null;
		if(str) str = str.replace(/-|\s|\.|\#/g, "_");
		else {
			str_ = "st_id_" + Object.keys(this.elements).length;
		}
		this.addId(el, str_);

		return str_;
	}
	private getElementId(el: st_dom_types): string {
		let id: string;
		if(el instanceof Array) id = el[0].getAttribute(this.props.id_data_attr);
		else id = el.getAttribute(this.props.id_data_attr);
		if(id) return id;
		else console.error("It is not a registered element with State Tasker id!");
	}

	setNewElement(prop: st_elInstanceProp): string {
		let id: string;
		let elements: st_dom_types;

		if(!prop.el) {
			if(prop.selector) {
				elements = this.searchElements(prop.selector, prop.type);
				prop.el = elements;
			}
			else console.error("Not defined element and selector!");
		}
		if(!prop.id) {
			id = this.createId(elements, prop.selector);
			prop.id = id;
		} else {
			id = prop.id;
			this.addId(elements, id);
		}
		if(!prop.type || prop.type == "el") prop.type = "el";
		else if(prop.type == "inp") prop.type = "inp";
		else if(prop.type == "inp2") prop.type = "inp2";
		if(prop.el instanceof Array) {
			this.elements[id] = [];
			for(let i = 0; i < prop.el.length; i++) {
				(<Array<instanceLeadEl>> this.elements[id])[i] = new instanceLeadEl(prop);
				(<Array<instanceLeadEl>> this.elements[id])[i].setDefault();
			}
		} else {
			this.elements[id] = new instanceLeadEl(prop);
			(<instanceLeadEl> this.elements[id]).setDefault();
		}
		return id;
	}

	activeState(el: string | st_dom_types, val: boolean): void {
		let instance: instanceLeadEl | instanceLeadEl[];
		if(typeof el == "string") instance = this.elements[el];
		else {
			let id = this.getElementId(el);
			if(id) instance = this.elements[id];
		}
		if(instance instanceof Array) {
			for(let i = 0; i < instance.length; i++) {
				if(val) instance[i].setActiveTrue();
				else instance[i].setActiveFalse();
			}
		} else {
			if(val) instance.setActiveTrue();
			else instance.setActiveFalse();
		}
	}
	addState(el: string | st_dom_types, val: st_state_type): void {
		let instance: instanceLeadEl | instanceLeadEl[];
		if(typeof el == "string") instance = this.elements[el];
		else {
			let id = this.getElementId(el);
			if(id) instance = this.elements[id];
		}
		if(instance instanceof Array) {
			for(let i = 0; i < instance.length; i++) {
				instance[i].setState(val);
			}
		} else {
			instance.setState(val);
		}
	}
	delState(el: string | st_dom_types, val: st_state_type): void {
		let instance: instanceLeadEl | instanceLeadEl[];
		if(typeof el == "string") instance = this.elements[el];
		else {
			let id = this.getElementId(el);
			if(id) instance = this.elements[id];
		}
		if(instance instanceof Array) {
			for(let i = 0; i < instance.length; i++) {
				instance[i].delState(val);
			}
		} else {
			instance.delState(val);
		}
	}
	changeState(el: string | st_dom_types, old_s: st_state_type, new_s: st_state_type): void {
		let instance: instanceLeadEl | instanceLeadEl[];
		if(typeof el == "string") instance = this.elements[el];
		else {
			let id = this.getElementId(el);
			if(id) instance = this.elements[id];
		}
		if(instance instanceof Array) {
			for(let i = 0; i < instance.length; i++) {
				instance[i].changeState(old_s, new_s);
			}
		} else {
			instance.changeState(old_s, new_s);
		}
	}
}

/* end Module Satte Tasker -------------------------------------------------- */