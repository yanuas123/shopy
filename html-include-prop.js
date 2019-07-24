let html_textes_obj = {
	/* countries ------------------------------------------------------------ */
	country: ["Polen", "Germany", "France"],
	/* categories ----------------------------------------------------------- */
	categories: [
		{
			"title": "Man",
			"name": "category_man",
			"data_input_prop": "like_radio_category"
		},
		{
			"title": "Women",
			"name": "category_women",
			"data_input_prop": "like_radio_category"
		},
		{
			"title": "Childrens",
			"name": "category_children",
			"data_input_prop": "like_radio_category"
		},
		{
			"title": "Hot Deals",
			"name": "category_hot_deals",
			"data_input_prop": "like_radio_category"
		}],
	/* brands --------------------------------------------------------------- */
	brands: [
		{
			"title": "Reebok",
			"name": "brand_reebok",
			"data_input_prop": ""
		},
		{
			"title": "Addidas",
			"name": "brand_addidas",
			"data_input_prop": ""
		},
		{
			"title": "Nike",
			"name": "brand_nike",
			"data_input_prop": ""
		},
		{
			"title": "Active",
			"name": "brand_active",
			"data_input_prop": ""
		}],
	/* products ------------------------------------------------------------- */
	product_list: [{
			"image_src": "images/images/good1.png",
			"product_name": "Reebok Track Jacket",
			"category": "man",
			"description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
			"description_sr": "Lorem Ipsum is simply <span class='text-highlighted'>dummy text</span> of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
			"size": "XL",
			"quantity": "2",
			"price": "120",
			"product_url": "product.html"
		},
		{
			"image_src": "images/images/good2.png",
			"product_name": "Reebok Track Jacket",
			"category": "woman",
			"description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
			"description_sr": "Lorem Ipsum is simply dummy text of the <span class='text-highlighted'>printing</span> and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
			"size": "L",
			"quantity": "1",
			"price": "100",
			"product_url": "product.html"
		},
		{
			"image_src": "images/images/good3.png",
			"product_name": "Reebok Track Jacket",
			"category": "children",
			"description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
			"description_sr": "Lorem Ipsum is simply dummy text of the <span class='text-highlighted'>printing</span> and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
			"size": "M",
			"quantity": "1",
			"price": "150",
			"product_url": "product.html"
		},
		{
			"image_src": "images/images/good1.png",
			"product_name": "Reebok Track Jacket",
			"category": "man",
			"description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
			"description_sr": "Lorem Ipsum is simply dummy text of the printing and <span class='text-highlighted'>typesetting</span> industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
			"size": "XL",
			"quantity": "3",
			"price": "320",
			"product_url": "product.html"
		},
		{
			"image_src": "images/images/good1.png",
			"product_url": "product.html",
			"product_name": "Reebok Track Jacket",
			"price": "80"
		},
		{
			"image_src": "images/images/good3.png",
			"product_url": "product.html",
			"product_name": "Reebok Track Jacket",
			"price": "80"
		},
		{
			"image_src": "images/images/good2.png",
			"product_url": "product.html",
			"product_name": "Reebok Track Jacket",
			"price": "80"
		},
		{
			"image_src": "images/images/good1.png",
			"product_url": "product.html",
			"product_name": "Reebok Track Jacket",
			"price": "80"
		},
		{
			"image_src": "images/images/good3.png",
			"product_url": "product.html",
			"product_name": "Reebok Track Jacket",
			"price": "80"
		}],
	/* footer menu ---------------------------------------------------------- */
	footer_menu: [{
			"title": "about us",
			"url": "#"
		},
		{
			"title": "contact us",
			"url": "#"
		},
		{
			"title": "support",
			"url": "#"
		},
		{
			"title": "our feed",
			"url": "#"
		},
		{
			"title": "terms and conditions",
			"url": "#"
		},
		{
			"title": "our privacy",
			"url": "#"
		},
		{
			"title": "join us",
			"url": "#"
		},
		{
			"title": "live support",
			"url": "#"
		}],
	/* sizes ---------------------------------------------------------------- */
	sizes: [
		{
			"title": "Small",
			"name": "size_s",
			"data_input_prop": ""
		},
		{
			"title": "Midum",
			"name": "size_m",
			"data_input_prop": ""
		},
		{
			"title": "Larg",
			"name": "size_l",
			"data_input_prop": ""
		},
		{
			"title": "X Larg",
			"name": "size_xl",
			"data_input_prop": ""
		}],
	/* price range ---------------------------------------------------------- */
	price_range_prop: [{
		"top_point": 1000,
		"top_val": 1200,
		"bottom_point": "100",
		"bottom_val": 0
		}]
};
module.exports = html_textes_obj;