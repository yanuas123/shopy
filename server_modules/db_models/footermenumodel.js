var mongoose = require("./mongo");
var schemaFooterMenu = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	link: String
});
var FooterMenu = mongoose.model("footer_menu", schemaFooterMenu);
module.exports = FooterMenu;