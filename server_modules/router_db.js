var express = require("express");
var router = express.Router();
//var ordermail = require("./modules/ordermail"); 
// function for send mail when order is confirmed


var db = require("./modules/mongo_connect"); // connect to function for working with mongoDB

const User = require('./db_models/usermodel');
const SocNetworks = require('./db_models/socnetworksmodel');
const PromoProducts = require('./db_models/promoproductsmodel');
const Products = require('./db_models/productsmodel');
const Orders = require('./db_models/ordersmodel');
const NewArrivals = require('./db_models/newarrivalsmodel');
const MainSlides = require('./db_models/mainslidesmodel');
const MainMenu = require('./db_models/mainmenumodel');
const Mailing = require('./db_models/mailingmodel');
const FooterMenu = require('./db_models/footermenumodel');
const Contacts = require('./db_models/contactsmodel');
const Categories = require('./db_models/categoriesmodel');
const BestSales = require('./db_models/bestsalesmodel');
const Colors = require('./db_models/colorsmodel');





/* contacts */
router.get("/contacts", function(req, res) {
	db.find(Contacts, "all", {
		res: res
	}, {
		succ: function(arg, data) {
			res.status(200).send(data[0]);
		}
	});
});
/* Social Networks */
router.get("/socnetworks", function(req, res) {
	db.find(SocNetworks, "all", {
		res: res
	});
});
/* Main Menu */
router.get("/mainmenu", function(req, res) {
	db.find(MainMenu, req.body, {
		res: res
	});
});
/* Footer Menu */
router.get("/footermenu", function(req, res) {
	db.find(FooterMenu, "all", {
		res: res
	});
});
/* Categories */
router.get("/categories", function(req, res) {
	console.log("get categories");
	db.find(Categories, "all", {
		res: res
	});
});
/* Colors */
router.get("/colors", function(req, res) {
	console.log("get colors");
	db.find(Colors, "all", {
		res: res
	});
});
/* Products */
router.get("/qty", function(req, res) {
	console.log("get qty");
	var prod = req.query.prod;
	if(prod) {
		db.find(Products, {
			_id: prod
		}, {
			res: res
		});
	} else res.status(401).send();
});
router.get("/products", function(req, res) {
	console.log("get products");
	if(req.query.prod) { // get cart products
		if(/_/.test(req.query.prod)) {
			id_arr = req.query.prod.split("_");
			db.find(Products, {
				_id: {
					$in: id_arr
				}
			}, {
				res: res
			});
		} else {
			db.find(Products, {
				_id: req.query.prod
			}, {
				res: res
			});
		}
	} else if(req.query.url) { // get product page
		let dirname = global.rootDir;
		res.sendFile(dirname + "/build/product.html");

	} else if(req.query.link) { // get product page product
		var callback = {
			succ: function(arg, data) {
				if(data[0].related_prod) {
					let prod_request = [];
					for(let i = 0; i < data[0].related_prod.length; i++) {
						prod_request[prod_request.length] = data[0].related_prod[i].id;
					}
					Products.find({
						"_id": {
							$in: prod_request
						}
					}, function(err, data2) {
						if(err) {
							res.status(500).send();
							return;
						}
						data[0]._doc.related_prod = data2;
						res.status(200).send(data);
					});
				} else {
					res.status(200).send(data);
				}
			}
		};
		db.find(Products, {
			url: req.query.link
		}, {
			res: res
		}, callback);
	} else if(req.query.ctgr) {
		let match_obj = [];

		let range = [0, 9];
		if(req.query.page) {
			let top = req.query.page * 9;
			range[0] = top - 9;
			range[1] = top;
		}

		let search_obj = {};
		if(req.query.top_val && req.query.bottom_val) {
			search_obj.price = {
				$gt: req.query.bottom_val,
				$lt: req.query.top_val
			};
			match_obj[match_obj.length] = {
				$match: {
					price: {
						$gt: +req.query.bottom_val,
						$lt: +req.query.top_val
					}
				}
			};
		}
		if(req.query.categories) {
			search_obj.category_name = req.query.categories;
			match_obj[match_obj.length] = {
				$match: {
					category_name: req.query.categories
				}
			};
		}
		if(req.query.brands) {
			let brand_arr;
			if(req.query.brands instanceof Array) {
				brand_arr = req.query.brands;
			}
			else brand_arr = [req.query.brands];

			search_obj.brand_name = {
				$in: brand_arr
			};
			match_obj[match_obj.length] = {
				$match: {
					brand_name: {
						$in: brand_arr
					}
				}
			};
		}
		if(req.query.sizes) {
			if(!req.query.sizes instanceof Array) req.query.sizes = [req.query.sizes];
			let sizes = [];
			for(let i = 0; i < req.query.sizes.length; i++) {
				let sz = "sizes." + req.query.sizes[i];
				sizes[sizes.length] = {
					[sz]: {
						$gt: 0
					}
				};
			}
			search_obj.qty = {
				$elemMatch: {
					$or: sizes
				}
			};
			match_obj[match_obj.length] = {
				$match: {
					qty: {
						$elemMatch: {
							$or: sizes
						}
					}
				}
			};
		}

		let callback = function(err, data) {
			if(err) {
				res.status(500).send();
				return;
			}
			res.status(200).send(data);
		};
		if(!req.query.page) Products.find(search_obj, callback);
		else {
			match_obj[match_obj.length] = {
				$skip: range[0]
			};
			Products.aggregate(match_obj).limit(range[1]).exec(callback);
		}
	} else if(req.query.page) { // product list pages
		let range = [0, 9];
		if(req.query.page) {
			let top = req.query.page * 9;
			range[0] = top - 9;
			range[1] = top;
		}
		Products.aggregate([{
				$skip: range[0]
			}]).limit(range[1]).exec(function(err, data) {
			if(err) {
				res.status(500).send();
				return;
			}
			res.status(200).send(data);
		});
	} else {
		db.find(Products, "all", {
			res: res
		});
	}
});
router.get("/searchproducts", function(req, res) {
	let serach_obj = {};
	let describe = null;
	if(req.query.category) serach_obj.category_name = req.query.category;
	if(req.query.brand) serach_obj.brand_name = req.query.brand;
	if(req.query.check_description) {
		serach_obj.$or = [{
				describe: {
					$regex: req.query.name,
					$options: "i"
				}
			}, {
				name: {
					$regex: req.query.name,
					$options: "i"
				}
			}];
	} else serach_obj.name = {
			$regex: req.query.name,
			$options: "i"
		};

	Products.find(serach_obj, function(err, data) {
		if(err) {
			res.status(500).send();
			return;
		}
		res.status(200).send(data);
	});
});

/* Promo Products */
router.get("/promoqty", function(req, res) {
	console.log("get promoqty");
	var prod = req.query.prod;
	if(prod) {
		db.find(PromoProducts, {
			_id: prod
		}, {
			res: res
		});
	} else res.status(401).send();
});
router.get("/promoproducts", function(req, res) {
	console.log("get promoproducts");
	if(req.query.prod) {
		db.find(PromoProducts, {
			_id: req.query.prod
		}, {
			res: res
		});
	} else if(req.query.link) {
		var callback = {
			succ: function(arg, data) {
				if(data.related_prod) {
					let prod_request = [];
					for(let i = 0; i < data.related_prod.length; i++) {
						prod_request[prod_request.length] = data.related_prod[i].id;
					}
					Products.find({
						"_id": {
							$in: prod_request
						}
					}, function(err, data2) {
						if(err) {
							res.status(500).send();
							return;
						}
						data.related_prod = data2;
						res.status(200).send(data);
					});
				}
			}
		};
		db.find(Products, {
			_id: req.query.link
		}, {
			res: res
		}, callback);
	} else {
		db.find(PromoProducts, "all", {
			res: res
		});
	}
});
/* Slider */
router.get("/mainslider", function(req, res) {
	console.log("get mainslider");
	db.find(MainSlides, "all", {
		res: res
	});
});
router.get("/mainslider_full", function(req, res) {
	console.log("get mainslider");
	var callback = {
		succ: function(arg, data) {
			let prod_request = [];
			let promoprod_request = [];
			for(let i = 0; i < data.length; i++) {
				if(data[i].related_id && data[i].type_info == "products") prod_request[prod_request.length] = data[i].related_id;
				if(data[i].related_id && data[i].type_info == "promoproducts") promoprod_request[promoprod_request.length] = data[i].related_id;
			}
			function findPromoProd(err, data1) {
				if(err) {
					res.status(500).send();
					return;
				}
				function finishFunc(err, data2) {
					if(err) {
						res.status(500).send();
						return;
					}
					if(data1 || data2) {
						for(let i = 0; i < data.length; i++) {
							if(data[i].related_id && data[i].type_info == "products" && data1.length) {
								for(let j = 0; j < data1.length; j++) {
									if(data1[j]._id == data[i].related_id) data[i].related_prod = data1[j];
								}
							} else if(data[i].related_id && data[i].type_info == "promoproducts" && data2.length) {
								for(let j = 0; j < data2.length; j++) {
									if(data2[j]._id == data[i].related_id) data[i].related_prod = data2[j];
								}
							}
						}
					}
					res.status(200).send(data);
				}
				if(promoprod_request.length) {
					PromoProducts.find({
						"_id": {
							$in: promoprod_request
						}
					}, finishFunc);
				} else finishFunc();
			}
			if(prod_request.length) {
				Products.find({
					"_id": {
						$in: prod_request
					}
				}, findPromoProd);
			} else findPromoProd();
		}
	};
	db.find(MainSlides, "all", {
		res: res
	}, callback);
});
/* Mailing */
router.put("/mailing", function(req, res) {
	db.create(Mailing, req.body, {
		res: res
	});
});

/* New Arrivals */
router.get("/newarrivals", function(req, res) {
	console.log("get new arrivals");
	let range = [0, 4];
	if(req.query.page) {
		let top = req.query.page * 4;
		range[0] = top - 4;
		range[1] = top;
	}
	console.log(range);
	var callback = function(err, data) {
		if(err) {
			res.status(500).send();
			return;
		}
		if(data.length) {
			if(data.length <= range[0]) {
				res.status(200).send([]);
				return;
			}

			let page_el = [];
			if(data.length < range[1]) range[1] = data.length;
			for(let i = range[0]; i < range[1]; i++) page_el[page_el.length] = data[i];
			data = page_el;

			let prod_request = [];
			for(let i = 0; i < data.length; i++) {
				prod_request[prod_request.length] = data[i].related_id;
			}
			console.log(prod_request);
			Products.find({
				"_id": {
					$in: prod_request
				}
			}, function(err, data2) {
				if(err) {
					res.status(500).send();
					return;
				}
				res.status(200).send(data2);
			});
		}
	};
	NewArrivals.find({}, callback);
});

/* Best Sales */
router.get("/bestsales", function(req, res) {
	console.log("get bestsales");
	var callback = {
		succ: function(arg, data) {
			if(data.length) {
				let prod_request = [];
				for(let i = 0; i < data.length; i++) {
					prod_request[prod_request.length] = data[i].related_id;
				}
				Products.find({
					"_id": {
						$in: prod_request
					}
				}, function(err, data2) {
					if(err) {
						res.status(500).send();
						return;
					}
					res.status(200).send(data2);
				});
			}
		}
	};
	db.find(BestSales, "all", {
		res: res
	}, callback);
});
router.put("/message", function(req, res) {
	res.status(200).send();
});

/* Orders */
router.put("/orders", function(req, res) {
	let order = req.body;
	Orders.countDocuments({}, function(err, data) {
		if(err) {
			res.status(500).send();
			return;
		}
		order.id = "order_id_" + data;
		order.closed = false;
		db.create(Orders, order, {
			res: res
		}, {
			succ: function() {
				res.status(201).send();
			}
		});
	});

	if(order.user_data && order.user_data.related_user) {
		User.find({
			_id: order.user_data.related_user
		}, function(err, data) {
			if(err) return;
			let new_data = {};
			if(order.user_data.phone && !data.phone) new_data.phone = order.user_data.phone;
			if(order.user_data.new_post_inf && !data.new_post_inf) {
				new_data.first_name = order.user_data.first_name;
				new_data.last_name = order.user_data.last_name;
				new_data.new_post_inf = order.user_data.new_post_inf;
			}
			if(order.user_data.address && !data.address) {
				new_data.first_name = order.user_data.first_name;
				new_data.last_name = order.user_data.last_name;
				new_data.address = order.user_data.address;
			}
			if(Object.keys(new_data).length) {
				User.updateOne({
					_id: order.user_data.related_user
				}, new_data, function() {

				});
			}
		});
	}
});

router.post("/forgotpass", function(req, res) {
	var callback = {
		succ: function(arg, data) {
			if(data.length) res.status(200).send();
			else res.status(204).send(["email"]);
		},
		nul: function(arg, data) {
			if(data) res.status(204).send(["email"]);
		}
	};
	db.find(User, req.body, {
		res: res
	}, callback);
});

/* User */
router.put("/user", function(req, res) {
	User.countDocuments({}, function(err, count) {
		if(err) {
			res.status(500).send();
			return;
		}
		req.body.id = "user_id_" + count;
		db.create(User, req.body, {
			res: res
		});
	});
});

/* Search */
router.post("/search", function(req, res) {
	let search_obj = {};
	if(req.body.category && req.body.category != "all_categories") search_obj.category_title = req.body.category;
	if(req.body.brand && req.body.brand != "all_brands") search_obj.brand_title = req.body.brand;
	if(!req.body.check_description || req.body.check_description == "no") {
		search_obj.name = {
			$regex: req.body.search,
			$options: "i"
		};
	} else {
		search_obj.$or = [{
				name: {
					$regex: req.body.search,
					$options: "i"
				}
			}, {
				describe: {
					$regex: req.body.search,
					$options: "i"
				}
			}];
	}
	let callback = {
		succ: function(arg, data) {
			db.find(PromoProducts, search_obj, {
				res: res
			}, function(args, data2) {
				let result = data.concat(data2);
				if(result.length) {
					res.status(200).send(result);
				} else {
					res.status(204).send();
				}
			});
		}
	};
	db.find(Products, search_obj, {
		res: res
	}, callback);
});

/* various data that must be on the every page of the site */
router.get("/startdata", function(req, res) {
	let main_data = {};
	db.find(Contacts, "all", {
		res: res
	}, {
		succ: function(arg1, data1) {
			main_data.contacts = data1;

			db.find(SocNetworks, "all", {
				res: res
			}, {
				succ: function(arg2, data2) {
					main_data.socnetworks = data2;

					db.find(MainMenu, "all", {
						res: res
					}, {
						succ: function(arg3, data3) {
							main_data.mainmenu = data3;

							db.find(FooterMenu, "all", {
								res: res
							}, {
								succ: function(arg4, data4) {
									main_data.footermenu = data4;

									res.status(200).send(main_data);
								}
							});
						}
					});
				}
			});
		}
	});
});


module.exports = router;