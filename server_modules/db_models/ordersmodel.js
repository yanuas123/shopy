var mongoose = require("./mongo");
var schemaOrders = new mongoose.Schema({
	id: {
		type: String,
		unique: true,
		required: true
	},
	total_price: Number,
	total_qty: Number,
	closed: {
		type: Boolean,
		required: true
	},
	product_data: {
		required: true,
		type: [{
				product_id: {
					type: String
				},
				name: {
					type: String
				},
				prod_type: {
					type: String
				},
				price: {
					type: Number
				},
				size: String,
				color: String,
				qty: {
					type: Number
				},
				total_price: {
					type: Number
				}
			}]
	},
	shipping_method: {
		type: String,
		required: true
	},
	user_data: {
		required: true,
		type: {
			related_user: String,
			phone: String,
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
			}
		}
	},
	payment_method: {
		type: String,
		required: true
	}
});
var Orders = mongoose.model("Order", schemaOrders);
module.exports = Orders;