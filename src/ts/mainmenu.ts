/* Main Menu compilation -------------- */

interface main_menu_obj {
	title: string;
	link?: string;
}
export function compileMainMenu(menu_block: HTMLElement, data: any, page_name: string) {
	let menu_obj = <main_menu_obj[]> data;
	menu_block.innerHTML = "";
	for(let i = 0; i < menu_obj.length; i++) {
		let a: HTMLAnchorElement = document.createElement("a");
		a.setAttribute("href", menu_obj[i].link);
		a.innerHTML = menu_obj[i].title;
		if(page_name == menu_obj[i].title.toLowerCase()) a.classList.add("active");
		let li = document.createElement("li");
		li.appendChild(a);
		menu_block.appendChild(li);
	}
}