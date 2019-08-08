var mongoose = require("./mongo");
var schemaMainSlides = new mongoose.Schema({
	id: {
		type: String,
		unique: true,
		required: true
	},
	title: String,
	subtitle: String,
	describe: String,
	price: Number,
	type_info: String,
	related_id: String,
	image: {
		type: String,
		required: true
	}
});
var MainSlides = mongoose.model("main_slides", schemaMainSlides);
module.exports = MainSlides;