/* Footer Menu compilation ------------ */

interface main_menu_obj {
	title: string;
	link?: string;
}
export function compileFooterMenu(menu_block: HTMLElement, data: any) {
	let menu_obj = <main_menu_obj[]> data;
	menu_block.innerHTML = "";
	for(let i = 0; i < menu_obj.length; i++) {
		let a: HTMLAnchorElement = document.createElement("a");
		a.setAttribute("href", menu_obj[i].link);
		a.innerHTML = menu_obj[i].title;
		let li = document.createElement("li");
		li.classList.add("footer_menu_item");
		li.appendChild(a);
		menu_block.appendChild(li);
	}
}