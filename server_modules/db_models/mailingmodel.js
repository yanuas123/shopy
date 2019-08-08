var mongoose = require("./mongo");
var schemaMailing = new mongoose.Schema({
	email: [{
			type: String
		}]
});
var Mailing = mongoose.model("Mailing", schemaMailing);
module.exports = Mailing;