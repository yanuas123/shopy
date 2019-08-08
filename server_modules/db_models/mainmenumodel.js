var mongoose = require("./mongo");
var schemaMainMenu = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	link: String
});
var MainMenu = mongoose.model("main_menu", schemaMainMenu);
module.exports = MainMenu;