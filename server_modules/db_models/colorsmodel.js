var mongoose = require("./mongo");
var schemaColors = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	title: {
		type: String,
		required: true,
		unique: true
	},
	hash: {
		type: String,
		required: true
	},
	class_name: String
});
var Colors = mongoose.model("Colors", schemaColors);
module.exports = Colors;