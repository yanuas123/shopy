var mongoose = require("./mongo");
var schemaCategories = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: true
	},
	title: String,
	first: Boolean,
	data_input_prop: String,
	items: [{
			name: {
				type: String
			},
			title: String
		}],
	bottom_point: Number,
	top_point: Number,
	bottom_val: Number,
	top_val: Number
});
var Categories = mongoose.model("Categories", schemaCategories);
module.exports = Categories;