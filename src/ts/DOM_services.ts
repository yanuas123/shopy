/* module DOM services ---------------- */
export function getAttrVal(el: HTMLElement, attr_name: string): string {
	return el.querySelector("["+attr_name+"]").getAttribute(attr_name);
}