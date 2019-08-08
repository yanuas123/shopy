var mongoose = require("./mongo");
var schemaAdmin = new mongoose.Schema({
	login: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});
var Admin = mongoose.model("Admin", schemaAdmin);
module.exports = Admin;