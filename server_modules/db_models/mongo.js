var mongoose = require("mongoose");
var auth = require("../../auth.js");
mongoose.connect(auth.mongo_pass.connect, {
	useNewUrlParser: true,
	useCreateIndex: true
});
module.exports = mongoose;