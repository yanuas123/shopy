/* module Copy Text Element to Buffer ------------- */
import {performTooltip} from "./tooltip";

export function CopyTextToBuffer(trigger_id: string, text_el_selector: string, tooltip_msg: string = "The text was copied"): void {
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