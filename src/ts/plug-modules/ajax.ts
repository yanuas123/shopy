/// <reference path="../@types/global.d.ts" />
import {Popup} from "../@types/global.d";

/* module Ajax request ------------ */

/* You can use methods from this module to perform Ajax request (on variable Request).
 * Properties and arguments described below. */

// types
export type ajax_methods = "GET" | "POST" | "PUT" | "DELETE";
export type ajax_content_type = "text" | "json";

// arguments for passing to methods
export interface postReqObj {
	action: string;
	data: any;

	callbacks?: {
		error?(error_desc: string): void; // status error
		network_error?(): void; // readyState error
		success?(data: any): void; // success function
		code_succ?: { // functions that perform if match to success codes
			[item: number]: (data: any) => void;
		}
	}
}
export interface getReqObj {
	action: string;

	callbacks?: {
		error?(error_desc: string): void;
		network_error?(): void;
		success?(data: any): void;
		code_succ?: {
			[item: number]: (data: any) => void;
		}
	}
}
export interface putReqObj {
	action: string;
	data: any;

	callbacks?: {
		error?(error_desc: string): void;
		network_error?(): void;
		success?(data: any): void;
		code_succ?: {
			[item: number]: (data: any) => void;
		}
	}
}
export interface delReqObj {
	action: string;
	data: any;

	callbacks?: {
		error?(error_desc: string): void;
		network_error?(): void;
		success?(data: any): void;
		code_succ?: {
			[item: number]: (data: any) => void;
		}
	}
}
// main methods
interface request {
	_get(prop: postReqObj): void;
	_post(prop: getReqObj): void;
	_put(prop: putReqObj): void;
	_delete(prop: delReqObj): void;
}
/* end of arguments */



// main properties
export interface ajax_prop {
	readonly content_type: {
		name: string;
		value: {
			text: string;
			object: string;
		};
	};
	status_desc: {
		succ: {
			[item: number]: string;
		};
		error: {
			[item: number]: string;
		};
	};
	callbacks: {
		error(error_desc: string): void;
		network_error(): void;
	}
}
// default properties
const DEF_PROP: ajax_prop = {
	content_type: {
		name: "Content-Type",
		value: {
			text: "text/plain",
			object: "application/json"
		}
	},

	status_desc: {
		succ: {
			200: "200 OK",
			201: "201 Created",
			204: "204 No Content",
			205: "205 Reset Content",
			304: "304 Not Modified"
		},

		error: {
			400: "400 Bad Request",
			401: "401 Unauthorized",
			403: "403 Forbidden",
			404: "404 Not Found",
			405: "405 Method Not Allowed",
			406: "406 Not Acceptable",
			415: "415 Unsupported Media Type",
			500: "500 Internal Server Error",
			502: "502 Bad Gateway",
			503: "503 Service Unavailable"
		}
	},
	callbacks: {
		error: (error_desc: string) => {
			let el = document.getElementById("info_popup_text");
			let div = document.createElement("<div>");
			div.classList.add("text_important");
			div.innerText = "error_desc";
			el.innerHTML = "";
			el.appendChild(div);
			Popup.open("information");
		},
		network_error: () => {
			let el = document.getElementById("info_popup_text");
			let div = document.createElement("<div>");
			div.classList.add("text_important");
			div.innerText = "Network error!";
			el.innerHTML = "";
			el.appendChild(div);
			Popup.open("information");
			console.error("Network error!");
		}
	}
};




interface req_fabric_obj {
	method: ajax_methods;
	action: string;
	type?: "text/plain" | "application/json";
	data?: any;

	callbacks: {
		error(error_desc: string): void;
		network_error(): void;
		success?(data: any): void;
		code_succ: {
			[item: number]: (data: any) => void;
		}
	}
}

class HttpRequest {
	readonly prop: ajax_prop;

	constructor() {
		this.prop = DEF_PROP;
	}

	private req_fabric(prop: req_fabric_obj): void {
		let xhr = new XMLHttpRequest();
		let req_class = this;
		if(prop.data) {
			if(typeof prop.data != "string") {
				prop.data = JSON.stringify(prop.data);
				prop.type = "application/json";
			} else prop.type = "text/plain";
		}

		xhr.onreadystatechange = function() {
			if(xhr.readyState !== 4) {
				prop.callbacks.network_error();
				return;
			}
			if(!req_class.prop.status_desc.succ[xhr.status]) {
				console.error(xhr.status + ":" + (xhr.statusText || req_class.prop.status_desc.error[xhr.status]));
				prop.callbacks.error("Server error: " + (xhr.statusText || req_class.prop.status_desc.error[xhr.status]));
			}
			else {
				let data;
				if(xhr.responseType == "json") data = JSON.parse(xhr.responseText);
				else data = xhr.responseText;

				if(prop.callbacks.code_succ[xhr.status]) prop.callbacks.code_succ[xhr.status](data);
				if(prop.callbacks.success) prop.callbacks.success(data);
			}
		};

		xhr.open(prop.method, prop.action, true);
		xhr.setRequestHeader(this.prop.content_type.name, prop.type);
		if(prop.data) xhr.send(prop.data);
		else xhr.send();
	}


	_get(prop: getReqObj): void {
		let callbacks;
		if(prop.callbacks) {
			callbacks = {
				error: prop.callbacks.error || undefined,
				network_error: prop.callbacks.network_error || undefined,
				success: prop.callbacks.success || undefined,
				code_succ: prop.callbacks.code_succ || undefined
			};
		}
		let new_prop: req_fabric_obj = {
			method: "GET",
			action: prop.action,

			callbacks: {
				error: callbacks.error || this.prop.callbacks.error,
				network_error: callbacks.network_error || this.prop.callbacks.network_error,
				success: callbacks.success,
				code_succ: callbacks.code_succ
			}
		};
		this.req_fabric(new_prop);
	}
	_post(prop: postReqObj): void {
		let callbacks;
		if(prop.callbacks) {
			callbacks = {
				error: prop.callbacks.error || undefined,
				network_error: prop.callbacks.network_error || undefined,
				success: prop.callbacks.success || undefined,
				code_succ: prop.callbacks.code_succ || undefined
			};
		}
		let new_prop: req_fabric_obj = {
			method: "POST",
			action: prop.action,
			data: prop.data,

			callbacks: {
				error: callbacks.error || this.prop.callbacks.error,
				network_error: callbacks.network_error || this.prop.callbacks.network_error,
				success: callbacks.success,
				code_succ: callbacks.code_succ
			}
		};
		this.req_fabric(new_prop);
	}
	_put(prop: putReqObj): void {
		let callbacks;
		if(prop.callbacks) {
			callbacks = {
				error: prop.callbacks.error || undefined,
				network_error: prop.callbacks.network_error || undefined,
				success: prop.callbacks.success || undefined,
				code_succ: prop.callbacks.code_succ || undefined
			};
		}
		let new_prop: req_fabric_obj = {
			method: "PUT",
			action: prop.action,
			data: prop.data,

			callbacks: {
				error: callbacks.error || this.prop.callbacks.error,
				network_error: callbacks.network_error || this.prop.callbacks.network_error,
				success: callbacks.success,
				code_succ: callbacks.code_succ
			}
		};
		this.req_fabric(new_prop);
	}
	_delete(prop: delReqObj): void {
		let callbacks;
		if(prop.callbacks) {
			callbacks = {
				error: prop.callbacks.error || undefined,
				network_error: prop.callbacks.network_error || undefined,
				success: prop.callbacks.success || undefined,
				code_succ: prop.callbacks.code_succ || undefined
			};
		}
		let new_prop: req_fabric_obj = {
			method: "DELETE",
			action: prop.action,
			data: prop.data,

			callbacks: {
				error: callbacks.error || this.prop.callbacks.error,
				network_error: callbacks.network_error || this.prop.callbacks.network_error,
				success: callbacks.success,
				code_succ: callbacks.code_succ
			}
		};
		this.req_fabric(new_prop);
	}
}
export let Request = new HttpRequest();