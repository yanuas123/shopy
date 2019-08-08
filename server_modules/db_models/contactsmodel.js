var mongoose = require("./mongo");
var schemaContacts = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: true
	},
	country_name: String,
	city: {
		type: String,
		required: true
	},
	street: String,
	house_number: String
});
var Contacts = mongoose.model("Contacts", schemaContacts);
module.exports = Contacts;