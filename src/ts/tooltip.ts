/* module Tooltip perform ------------- */
export function performTooltip(el: HTMLElement, text: string): void {
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