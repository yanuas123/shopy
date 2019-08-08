var mongoose = require("./mongo");
var schemaNewArrivals = new mongoose.Schema({
	related_id: [String]
});
var NewArrivals = mongoose.model("new_arrivals", schemaNewArrivals);
module.exports = NewArrivals;