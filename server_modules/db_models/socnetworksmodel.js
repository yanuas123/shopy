var mongoose = require("./mongo");
var schemaSocNetworks = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: true
	},
	link: {
		type: String,
		required: true
	},
	class_name: String
});
var SocNetworks = mongoose.model("soc_networks", schemaSocNetworks);
module.exports = SocNetworks;