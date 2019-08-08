var mongoose = require("./mongo");
var sizes_qty = new mongoose.Schema({
	any: Number,
	s: Number,
	m: Number,
	l: Number,
	xl: Number
});
var colors_qty = new mongoose.Schema({
	name: {
		type: String
	},
	title: {
		type: String
	},
	hash: {
		type: String
	},
	class_name: String,
	sizes: {
		type: sizes_qty
	}
});
var schemaProducts = new mongoose.Schema({
	id: {
		type: String,
		unique: true,
		required: true
	},
	name: {
		type: String,
		required: true,
		unique: true
	},
	subtitle: String,
	describe: String,
	soc_networks: [{
			title: {
				type: String
			},
			link: {
				type: String
			},
			class_name: String
		}],
	main_photo: {
		type: String,
		required: true
	},
	photos: [String],
	price: {
		type: Number,
		required: true
	},
	qty: [colors_qty],
	related_prod: [{
			id: String,
			name: String
		}],
	category_title: String,
	category_name: {
		type: String,
		required: true
	},
	brand_title: String,
	brand_name: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: true,
		unique: true
	},
	types: {
		type: String,
		required: true
	},
	saled: Number,
	liked: Number,
	rating: Number
});
var Products = mongoose.model("Product", schemaProducts);
module.exports = Products;