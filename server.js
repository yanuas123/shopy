var express = require("express");
var app = express();


app.use(express.static(__dirname + "/build")); // static domain url


var bodyParser = require("body-parser"); // XMLHttp content parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());





app.get("/", function(req, res) {
    res.sendFile(__dirname + "/build/contact.html");
});


app.listen(process.env.PORT || 8080);
console.log("Run server!");