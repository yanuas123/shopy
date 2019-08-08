var mongoose = require("./mongo");
var schemaBestSales = new mongoose.Schema({
	related_id: {
		type: String,
		required: true
	},
	rating: Number
});
var BestSales = mongoose.model("best_sales", schemaBestSales);
module.exports = BestSales;