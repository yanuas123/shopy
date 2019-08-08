
app.controller("promoproductsCtrl", function($scope, $http) {
	var CONTROLLER_ACTION = "/adm_promoproducts";
	var GET_CONTROLLER_ACTION = "/promoproducts";
	var GET_QTY_ACTION = "/promoqty";



	/* downloading data */
	$scope.products = null;
	$scope.colors = null;
	$scope.categories = null;
	$scope.brands = null;

	$scope.$on("categories", function(e, data) {
		$scope.data.forEach(function(el, i) {
			if(el.name == "categories") {
				$scope.categories = el.items;
			} else if(el.name == "brands") {
				$scope.brands = el.items;
			}
		});
		$scope.$apply();
	});
	$scope.$on("colors", function(e, data) {
		$scope.colors = data;
		$scope.$apply();
	});
	$scope.$on("promoproducts", function(e, data) {
		$scope.products = data;
		$scope.$apply();
	});

	$scope.$on("view", function(e, data) {

	});
	/* end downloading data */

	// modal download file
	$scope.file_field = "Add photo";
	window.onload = function() {
		var input_file = document.getElementById("upl"); // input for downloading image-file
		input_file.onchange = function() {
			if(input_file.files[0].name) {
				$scope.file_field = input_file.files[0].name;
				$scope.$apply();
			}
		};
	};



	$scope.edit_product = {};
	var index_edit_product = null;
	var modal_mode_product = null;


	/* edit social networks */
	$scope.social_label = "";
	$scope.social_index = null;
	$scope.edit_social = {};
	$scope.change_social = function() {
		if($scope.social_label) {
			if($scope.edit_product.soc_networks instanceof Array) {
				$scope.edit_product.soc_networks.forEach(function(el, i) {
					if(el.title == $scope.social_label) {
						$scope.edit_social = el;
						$scope.social_index = i;
					}
				});
			}
		} else {
			$scope.social_index = null;
			$scope.edit_social = {};
		}
	};
	$scope.add_social = function() {
		if($scope.edit_social.title && $scope.edit_social.link) {
			if($scope.edit_product.soc_networks instanceof Array) {
				if($scope.social_index) {
					$scope.edit_product.soc_networks[$scope.social_index] = $scope.edit_social;
				} else {
					$scope.edit_product.soc_networks[$scope.edit_product.soc_networks.length] = $scope.edit_social;
				}
			} else {
				$scope.edit_product.soc_networks = [$scope.edit_social];
			}
		}
	};

	/* edit related product */
	$scope.del_related = function(index) {
		delete $scope.edit_product.related_prod[index];
	};
	$scope.related_p_label = null;
	$scope.add_related = function() {
		if($scope.related_p_label) {
			$scope.products.forEach(function(el, i) {
				if(el._id == $scope.related_p_label) {
					var obj = {
						id: el._id,
						name: el.name
					};
					if($scope.edit_product.related_prod) {
						$scope.edit_product.related_prod[$scope.edit_product.related_prod.length] = obj;
					} else {
						$scope.edit_product.related_prod = [obj];
					}
				}
			});
		}
	};

	/* images */
	$scope.del_main_img = function() {
		$scope.edit_product.main_photo = null;
	};
	$scope.del_image = function(item) {
		$scope.edit_product.photo.forEach(function(el, i) {
			if(item == el) delete $scope.edit_product.photo[i];
		});
	};

	/* add new color */
	$scope.new_color_label = null;
	$scope.add_color = function() {
		var color_obj = null;
		$scope.colors.forEach(function(el, i) {
			if(el._id == $scope.new_color_label) color_obj = el;
		});
		$scope.edit_product.qty[$scope.edit_product.qty.length] = color_obj;
	};




	$scope.edit = function(index) {

		index_edit_product = index;
		modal_mode_product = "edit";
		$scope.edit_product = $scope.products[index];
		$('#modalEditPromoProducts').modal('show');
	};
	$scope.create = function() {

		index_edit_product = $scope.products.length;
		modal_mode_product = "create";
		$('#modalEditPromoProducts').modal('show');
	};

	$scope.save = function() {

		if(modal_mode_product == "create") $scope.edit_product.id = "prod_" + $scope.products.length;
		$scope.categories.forEach(function(el, i) {
			if(el.name == $scope.edit_product.category_name) $scope.edit_product.category_title = el.title;
		});
		$scope.brands.forEach(function(el, i) {
			if(el.name == $scope.edit_product.brand_name) $scope.edit_product.brand_title = el.title;
		});

		$scope.products[index_edit_product] = $scope.edit_product;
		if(modal_mode_product == "edit") {
			$http.post(CONTROLLER_ACTION, $scope.edit_product).then(function(data) {
				if(DB_error(data)) return;
				$scope.edit_product = {};
			});
		} else if(modal_mode_product == "create") {
			$http.put(CONTROLLER_ACTION, $scope.edit_product).then(function(data) {
				if(DB_error(data)) return;
				$scope.edit_product = {};
			});
		}
		index_edit_product = null;
		modal_mode_product = null;
	};

	$scope.del = function(index) {

		var obj = {
			_id: $scope.products[index]._id
		};
		$http.delete(CONTROLLER_ACTION, obj).then(function(data) {
			if(DB_error(data)) return;
			$scope.products[index] = null;
		});
	};

});