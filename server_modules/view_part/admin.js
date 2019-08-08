var app = angular.module("app", []);


app.directive("ngGetUrl", function() { // get image-url from hidden iframe
    return function(scope, element, attr) {
        element.on("load", function(e) {
            var path = e.target.contentDocument.body.innerHTML;
			console.log("path", path);
			scope.$apply(function() {
				console.log(scope.edit_product);
				if(scope.edit_product.main_photo) {
					if(scope.edit_product.photos instanceof Array) {
						scope.edit_product.photos[scope.edit_product.photos.length] = path;
					} else {
						scope.edit_product.photos = [path];
					}
				} else scope.edit_product.main_photo = path;
            });
        });
    };
});

app.directive("ngGetUrls", function() { // get image-url from hidden iframe
	return function(scope, element, attr) {
		element.on("load", function(e) {
			var path = e.target.contentDocument.body.innerHTML;
			scope.$apply(function() {
				scope.edit_obj.image = path;
			});
		});
	};
});



app.controller("mainCtrl", function($scope, $rootScope, $http) {
	// $broadcast-listening: to all view

	// $broadcast-listening: to many categories
	// $broadcast-listening: to many colors


    // view properties
    $scope.current = {
        view: null,
		controller: null
	};
	function performBroad() {
		$rootScope.$broadcast("view", $scope.current.controller);
	}

	var viewsProp = [{
			view: "view/users.html",
			controller: "users"
		}, {
			view: "view/contacts.html",
			controller: "contacts"
		}, {
			view: "view/socnetworks.html",
			controller: "socnetworks"
		}, {
			view: "view/mainmenu.html",
			controller: "mainmenu"
		}, {
			view: "view/footermenu.html",
			controller: "footermenu"
		}, {
			view: "view/mainslider.html",
			controller: "mainslider"
		}, {
			view: "view/products.html",
			controller: "products"
		}, {
			view: "view/promoproducts.html",
			controller: "promoproducts"
		}, {
			view: "view/orders.html",
			controller: "orders"
		}, {
			view: "view/categories.html",
			controller: "categories"
		}, {
			view: "view/colors.html",
			controller: "colors"
		}];
	$scope.showView = function(title) {
		viewsProp.forEach(function(el, i) {
			if(el.controller == title) {
				$scope.current.view = el.view;
				$scope.current.controller = el.controller;
			}
		});
		performBroad();
		scrollTop();
	};

	/* common data download ----------------------- */

	$scope.categories = {};
	$scope.colors = {};
	$scope.products = {};
	$scope.promoproducts = {};

	$http.get("/categories").then(function(data) {
		if(DB_error(data)) return;
		$scope.categories = data.data;
		$rootScope.$broadcast("categories", $scope.categories);
	});
	$http.get("/colors").then(function(data) {
		if(DB_error(data)) return;
		$scope.colors = data.data;
		$rootScope.$broadcast("colors", $scope.colors);
	});
	$http.get("/products").then(function(data) {
		if(DB_error(data)) return;
		$scope.products = data.data;
		$rootScope.$broadcast("products", $scope.products);
		console.log("broad prod");
	});
	$http.get("/promoproducts").then(function(data) {
		if(DB_error(data)) return;
		$scope.promoproducts = data.data;
		$rootScope.$broadcast("promoproducts", $scope.promoproducts);
	});
	function sendingCtrlData() {
		$rootScope.$broadcast("categories", $scope.categories);
		$rootScope.$broadcast("colors", $scope.colors);
		$rootScope.$broadcast("products", $scope.products);
		$rootScope.$broadcast("promoproducts", $scope.promoproducts);
	}
	$scope.$on("askData", function(e, data) {
		sendingCtrlData();
	});


	/* end common data download ------------------- */


    // logout function
    $scope.logoutadmin = function() {
        $.get("/logout", function(data) {
			console.log("logout");
            location.reload();
        });
    };

});

/* mailing modal controller */
app.controller("mailingCtrl", function($scope, $http) {
	$scope.mail = {
		title: "",
		body: ""
	};

	$scope.sendForm = function() {
		var obj = $scope.mail;
		$http.post("/adm_mailing", obj).then(function(data) {
			if(DB_error(data)) return;
			alert(data.data);
			$scope.mail = {};
		});
	};
});