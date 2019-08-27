var express = require("express");
var app = express();

global.rootDir = __dirname;
app.use(express.static(__dirname + "/build")); // static domain url
app.use(express.static(__dirname + "/server_modules/view_part")); // static domain url


var bodyParser = require("body-parser"); // XMLHttp content parser
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

var cookieParser = require("cookie-parser")(); // cookie parser
app.use(cookieParser);
var session = require("cookie-session")({// connect module cookie-session and access-time two hours
	keys: ["secret"],
	maxAge: 2 * 60 * 60 * 1000
});
app.use(session);

var passport = require("passport"); // connect module passport
app.use(passport.initialize());
app.use(passport.session());

var multer = require("multer"); // connect service for save downloaded file
var multer_properties = require("./server_modules/modules/multer_properties");
var storage = multer.diskStorage(multer_properties);
var upload = multer({
	storage: storage
});

var db = require("./server_modules/modules/mongo_connect"); // connect to function for working with mongoDB
var Admin = require("./server_modules/db_models/adminmodel"); // connect Admin model
var User = require("./server_modules/db_models/usermodel"); // connect User model

/* authorization ------------------------------------------------------------ */
var LocalStrategy = require("passport-local").Strategy; // connect Local Strategy for authetication and create instance passport-local
passport.use(new LocalStrategy(function(username, password, done) {
	var sr = {
		login: username,
		password: password
	};
	Admin.find(sr, function(err, data) { // find admin account
		if(err) {
			console.log(err);
			return "Database error!";
		}
		if(data.length) {

			var return_obj = {
				_id: data[0]._id
			};
			return done(null, return_obj);
		} else {
			var sr = {
				email: username,
				password: password
			};
			User.find(sr, function(err, data) { // find user account
				console.log(data);
				if(err) {
					console.log(err);
					return "Database error!";
				}
				if(data.length) {
					var return_obj = {
						_id: data[0]._id
					};
					return done(null, return_obj);
				} else
					return done(null, false);
			});
		}
	});
}
));

passport.serializeUser(function(user, done) { // serializing
	return done(null, user);
});

passport.deserializeUser(function(user, done) { // deserializing
	var sr = {
		_id: user._id
	};
	Admin.find(sr, function(err, data) {
		if(err) {
			console.log(err);
			return "Database error!";
		}
		if(data.length) {
			var return_obj = {
				username: data[0].login,
				id: data[0]._id
			};
			return done(null, return_obj);
		} else
			User.find(sr, function(err, data) {
				console.log(data);
				if(err) {
					console.log(err);
					return "Database error!";
				}
				if(data.length) {
					let dt = data[0];
					if(dt.remember_ip) delete dt.remember_ip;
					if(dt.password) delete dt.password;
					return done(null, data[0]);
				} else
					return done(null, false);
			});
	});
});

var adminLogRout = {
	successRedirect: "/admin",
	failureRedirect: "/adminlogin"
};
var authAdmin = passport.authenticate("local", adminLogRout);
var userLogRout = {
	successRedirect: "/",
	failureFlash: true
};
var auth = passport.authenticate("local", userLogRout);
var isAuthAdmin = function(req, res, next) {
	if(req.isAuthenticated() && req.user.username)
		next();
	else
		res.redirect("/adminlogin");
};
/* end Authorization -------------------------------------------------------- */

// authentication routing
app.get("/", function(req, res) {
	res.sendFile(__dirname + "/build/index.html");
});
app.post("/login", auth);
app.get("/admin", isAuthAdmin);
app.get("/admin", function(req, res) {
	res.sendFile(__dirname + "/server_modules/view_part/admin.html");
});
app.get("/adminlogin", function(req, res) {
	res.sendFile(__dirname + "/server_modules/view_part/login.html");
});
app.post("/adminlogin", authAdmin);

app.get("/getuser", function(req, res) {
	if(req.session) {
		if(req.user) {
			res.status(200).send(req.user);
		} else
			res.status(204).send(false);
	} else
		res.status(204).send(false);
});
app.post("/adminvalid", function(req, res) {
	var callback = {
		nul: function(args) {
			args.res.status(406).send("Invalid login or password!");
			return;
		},
		succ: function(args) {
			args.res.status(200).send(true);
		}
	};
	db.find(Admin, req.body, {
		res: res
	}, callback);
});

app.get("/logout", function(req, res) {
	req.logout();
	res.status(200).send();
});






/* routing ------------------------------------------------------------------ */
/* admin routing -------------------------- */

/* connect database */
const Contacts = require('./server_modules/db_models/contactsmodel');
const SocNetworks = require('./server_modules/db_models/socnetworksmodel');
const MainMenu = require('./server_modules/db_models/mainmenumodel');
const Orders = require('./server_modules/db_models/ordersmodel');
const MainSlides = require('./server_modules/db_models/mainslidesmodel');
const Mailing = require('./server_modules/db_models/mailingmodel');
const FooterMenu = require('./server_modules/db_models/footermenumodel');
const Products = require('./server_modules/db_models/productsmodel');
const PromoProducts = require('./server_modules/db_models/promoproductsmodel');
const Categories = require('./server_modules/db_models/categoriesmodel');
const Colors = require('./server_modules/db_models/colorsmodel');
const NewArrivals = require('./server_modules/db_models/newarrivalsmodel');
const BestSales = require('./server_modules/db_models/bestsalesmodel');

/* routing */

/* mailing */
app.post("/adm_mailing", isAuthAdmin);
app.post("/adm_mailing", function(req, res) {
	console.log("mailing");
	let emails = null;
	function mail(args, data) {
		console.log(data.length);
	}
	var callback = {
		succ: mail
	};
	db.find(Mailing, "all", {
		res: res
	}, callback);
});

/* users */
app.get("/adm_users", isAuthAdmin);
app.get("/adm_users", function(req, res) {
	console.log("get users");
	console.log(req.query.u);
	if(req.query.u) db.find(User, req.query.u, {
			res: res
		});
	else db.find(User, "all", {
			res: res
		});
});
app.delete("/adm_users", isAuthAdmin);
app.delete("/adm_users", function(req, res) {
	console.log("del users");
	db.delete(User, req.body, {
		res: res
	});
});

/* contacts */
app.post("/adm_contacts", isAuthAdmin);
app.post("/adm_contacts", function(req, res) {
	console.log("edit cintacts");
	db.update(Contacts, req.body, {
		res: res
	});
});

/* Social Networks */
app.post("/adm_socnetworks", isAuthAdmin);
app.post("/adm_socnetworks", function(req, res) {
	console.log("edit socnetworks");
	db.update(SocNetworks, req.body, {
		res: res
	});
});

/* Main Menu */
app.post("/adm_mainmenu", isAuthAdmin);
app.post("/adm_mainmenu", function(req, res) {
	console.log("edit mainmenu");
	db.update(MainMenu, req.body, {
		res: res
	});
});
app.put("/adm_mainmenu", isAuthAdmin);
app.put("/adm_mainmenu", function(req, res) {
	console.log("create mainmenu");
	db.create(MainMenu, req.body, {
		res: res
	});
});
app.delete("/adm_mainmenu", isAuthAdmin);
app.delete("/adm_mainmenu", function(req, res) {
	console.log("delte mainmenu");
	db.delete(MainMenu, req.body, {
		res: res
	});
});

/* Footer Menu */
app.post("/adm_footermenu", isAuthAdmin);
app.post("/adm_footermenu", function(req, res) {
	console.log("edit footermenu");
	db.update(FooterMenu, req.body, {
		res: res
	});
});
app.put("/adm_footermenu", isAuthAdmin);
app.put("/adm_footermenu", function(req, res) {
	console.log("create footermenu");
	db.create(FooterMenu, req.body, {
		res: res
	});
});
app.delete("/adm_footermenu", isAuthAdmin);
app.delete("/adm_footermenu", function(req, res) {
	console.log("delte footermenu");
	db.delete(FooterMenu, req.body, {
		res: res
	});
});

/* Categories */
app.post("/adm_categories", isAuthAdmin);
app.post("/adm_categories", function(req, res) {
	console.log(req.body);
	Categories.updateOne({
		_id: req.body.id
	}, {
		$push: {
			"items": req.body.items
		}
	}, function(err, data) {
		if(err) {
			res.status(500).send();
			return;
		}
		res.status(200).send();
	});
});

/* Colors */
app.put("/adm_colors", isAuthAdmin);
app.put("/adm_colors", function(req, res) {
	console.log("create colors");
	db.create(Colors, req.body, {
		res: res
	});
});


/* Products */
app.post("/adm_qty", isAuthAdmin);
app.post("/adm_qty", function(req, res) {
	console.log("get qty");
	var select = {
		_id: req.body.id
	};
	var deep_el = "qty.$[elem].sizes." + req.body.size;
	var obj = {
		$inc: {
			[deep_el]: req.body.qty
		}
	};
	var filter = {
		arrayFilters: [{
				"elem.name": req.body.color
			}]
	};
	Products.updateOne(select, obj, filter, function(err, data) {
		if(err) {
			res.status(500).send();
			return;
		}
		res.status(200).send();
	});
});
app.post("/adm_products", isAuthAdmin);
app.post("/adm_products", function(req, res) {
	console.log("edit products");
	if(req.body.saled) {
		req.body.$inc = {
			saled: req.body.saled
		};
		delete req.body.saled;
	}
	db.update(Products, req.body, {
		res: res
	});
});
app.put("/adm_products", isAuthAdmin);
app.put("/adm_products", function(req, res) {
	console.log("create products");
	req.body.types = "products";
	var callback = {
		succ: function(arg, data) {
			arg.res.status(200).send();
			arg.id = data._id;

			NewArrivals.countDocuments({}, function(err, count) {

				if(!err) {
					if(count > 7) {
						NewArrivals.find({}, function(err, data2) {
							if(err) return;
							let el_id = data2[0]._id;
							NewArrivals.deleteOne({
								_id: el_id
							});
						});
						let new_arrival = new NewArrivals({
							related_id: arg.id
						});
						new_arrival.save();
					} else {
						let new_arrival = new NewArrivals({
							related_id: arg.id
						});
						new_arrival.save();
					}
				}
			});
		}
	};
	db.create(Products, req.body, {
		res: res
	}, callback);
});
app.delete("/adm_products", isAuthAdmin);
app.delete("/adm_products", function(req, res) {
	console.log("delte products");
	var callback = {
		succ: function() {
			NewArrivals.findOneAndDelete({
				_id: req.body._id
			});
			BestSales.findOneAndDelete({
				_id: req.body._id
			});
		}
	};
	db.delete(Products, req.body, {
		res: res
	}, callback);
});

/* Promo Products */
app.post("/adm_promoqty", isAuthAdmin);
app.post("/adm_promoqty", function(req, res) {
	console.log("get qty");
	var select = {
		_id: req.body.id,
		qty: {
			$elemMatch: {
				title: req.body.color
			}
		}
	};
	var deep_el = "qty.$.sizes." + req.body.size;
	var obj = {
		$inc: {
			[deep_el]: req.body.qty
		}
	};
	PromoProducts.updateOne(select, obj, function(err, data) {
		if(err) {
			res.status(500).send();
			return;
		}
		res.status(200).send();
	});
});
app.post("/adm_promoproducts", isAuthAdmin);
app.post("/adm_promoproducts", function(req, res) {
	console.log("edit promoproducts");
	req.body.types = "promoproducts";
	db.update(PromoProducts, req.body, {
		res: res
	});
});
app.put("/adm_promoproducts", isAuthAdmin);
app.put("/adm_promoproducts", function(req, res) {
	console.log("create promoproducts");
	db.create(PromoProducts, req.body, {
		res: res
	});

});
app.delete("/adm_promoproducts", isAuthAdmin);
app.delete("/adm_promoproducts", function(req, res) {
	console.log("delte promoproducts");
	db.delete(PromoProducts, req.body, {
		res: res
	});
});

/* Orders */
app.get("/adm_orders", isAuthAdmin);
app.get("/adm_orders", function(req, res) {
	db.find(Orders, "all", {
		res: res
	});
});
app.post("/adm_orders", isAuthAdmin);
app.post("/adm_orders", function(req, res) {
	if(req.body.closed) {
		for(let i = 0; i < req.body.product_data.length; i++) {
			let DB = null;
			if(req.body.product_data[i].prod_type == "products") DB = Products;
			else if(req.body.product_data[i].prod_type == "promoproducts") DB = PromoProducts;
			DB.updateOne({
				_id: req.body.product_data[i].product_id
			}, {
				$inc: {
					saled: req.body.product_data[i].qty
				}
			}, function(err, res) {
			});
		}
	}
	Orders.updateOne({
		_id: req.body._id
	}, {
		closed: req.body.closed
	}, function(err, data3) {
		if(err) {
			res.status(500).send();
			return;
		}
		res.status(200).send();
	});
});
app.delete("/adm_orders", isAuthAdmin);
app.delete("/adm_orders", function(req, res) {
	console.log("delte orders");
	db.delete(Orders, req.body, {
		res: res
	});
});

/* Slider */
app.post("/adm_mainslider", isAuthAdmin);
app.post("/adm_mainslider", function(req, res) {
	console.log("edit mainslider");
	db.update(MainSlides, req.body, {
		res: res
	});
});
app.put("/adm_mainslider", isAuthAdmin);
app.put("/adm_mainslider", function(req, res) {
	console.log("create mainslider");
	db.create(MainSlides, req.body, {
		res: res
	});
});
app.delete("/adm_mainslider", isAuthAdmin);
app.delete("/adm_mainslider", function(req, res) {
	console.log("delte mainslider");
	db.delete(MainSlides, req.body, {
		res: res
	});
});

const Schedule = require('node-schedule');
let updateBastSales = Schedule.scheduleJob("0", function() {
	BestSales.remove({});
	Products.find({
		saled: {
			$exists: true
		}
	}, function(err, data) {
		if(err) {
			console.error("Update Best Sales ERROR !");
			return;
		}
		let products = [];
		let max_like = 0;
		for(let i = 0; i < data.length; i++) {
			let obj = {
				related_id: data[i]._id,
				rating: data[i].liked || 1,
				saled: data[i].saled || 0
			};
			if(products.length <= 3) {
				products.push(obj);
			} else {
				let min_obj = products[0];
				let index = 0;
				for(let j = 0; j < products.length; j++) {
					if(min_obj && min_obj.saled > products[j].saled) {
						min_obj = products[j];
						index = j;
					}
				}
				if(obj.saled > min_obj.saled) {
					products[index] = obj;
				}
			}
			if(data[i].liked && max_like < data[i].liked) max_like = data[i].liked;
		}
		max_like = max_like / 4;
		for(let i = 0; i < products.length; i++) {
			products[i].rating = Math.ceil(products[i].rating / max_like) || 1;
			Products.updateOne({
				_id: products[i].related_id
			}, {
				$set: {
					rating: products[i].rating
				}
			}, function() {

			});
			let element = new BestSales(products[i]);
			element.save();
		}
	});
});




app.post("/addlike", function(req, res) {
	if(req.session) {
		let user = {
			_id: req.user._id
		};
		User.updateOne(user, {
			$push: {
				liked_prod: req.body
			}
		}, function() {
			res.status(200).send();
		});
		let DB = null;
		if(req.body.types == "products") DB = Products;
		else if(req.body.types == "promoproducts") DB = PromoProducts;
		DB.updateOne({
			_id: req.body.id
		}, {
			$inc: {
				liked: 1
			}
		}, function() {});
	} else res.status(401).send();
});
app.post("/dellike", function(req, res) {
	if(req.session) {
		let user = {
			_id: req.user._id
		};
		User.updateOne(user, {
			$pull: {
				liked_prod: req.body
			}
		}, function() {
			res.status(200).send();
		});
		let DB = null;
		if(req.body.types == "products") DB = Products;
		else if(req.body.types == "promoproducts") DB = PromoProducts;
		DB.updateOne({
			_id: req.body.id
		}, {
			$inc: {
				liked: -1
			}
		}, function() {});
	} else res.status(401).send();
});


/* end Routing -------------------------------------------------------------- */










// file uploading
app.post("/upload_file", upload.single("upl"), function(req, res) {
	console.log(req.file);
	let file_path = req.file.path.substring(req.file.path.indexOf("\\") + 1);
	res.status(201).send(file_path);
});
// file uploading
app.post("/upload_file2", upload.single("upl2"), function(req, res) {
	console.log(req.file);
	let file_path = req.file.path.substring(req.file.path.indexOf("\\") + 1);
	res.status(201).send(file_path);
});

var router = require("./server_modules/router_db");
app.use("/", router);


app.listen(process.env.PORT || 8080);
console.log("Run server!");