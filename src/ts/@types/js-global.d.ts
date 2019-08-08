// coockie parser
interface docCookies {
	setItem(name: string, value: string, end: number): void;
	getItem(name: string): string;
	removeItem(name: string): void;
}
declare let docCookies: docCookies;

// categories
interface category_prop {
	name: string;
	title: string;
	first?: boolean;
	bottom_point?: number;
	top_point?: number;
	bottom_val?: number;
	top_val?: number;
	data_input_prop: string;
	items?: {
		name: string;
		title: string;
	}[];
}
declare interface categories_ {
	[item: string]: category_prop
}