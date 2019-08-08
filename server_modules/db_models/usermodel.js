var mongoose = require('./mongo');
var schemaUser = new mongoose.Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	phone: String,
	password: {
		type: String,
		required: true
	},
	remember_ip: [String],
	first_name: String,
	last_name: String,
	new_post_inf: {
		newpost_city: {
			type: String
		},
		newpost_department: {
			type: Number
		}
	},
	address: {
		country_name: {
			type: String
		},
		city: {
			type: String
		},
		post_code: {
			type: String
		},
		street: {
			type: String
		},
		house_number: {
			type: String
		}
	},
	liked_prod: [{
			id: {
				type: String
			},
			types: {
				type: String
			}
		}]
});
var User = mongoose.model("User", schemaUser);
module.exports = User;