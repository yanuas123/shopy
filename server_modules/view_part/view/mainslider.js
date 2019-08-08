
app.controller("mainsliderCtrl", function($scope, $http) {
	var CONTROLLER_ACTION = "/adm_mainslider";
	var GET_CONTROLLER_ACTION = "/mainslider";

	var GET_PRODUCT_ACTION = "/products?prod=";
	var GET_PROMOPRODUCT_ACTION = "/promoproducts?prod=";



	/* downloading data */

	$scope.data = null;
	$scope.slides = null;

	function concatData() {
		$scope.slides = [];
		$scope.data.forEach(function(el, i) {
			if(el.type_info && el.related_id) {
				var url = null;
				if(el.type_info == "products") url = GET_PRODUCT_ACTION;
				else if(el.type_info == "promoproducts") url = GET_PROMOPRODUCT_ACTION;
				$http.get(url + el.related_id).then(function(data) {
					if(DB_error(data)) return;
					el.related = data.data;
					$scope.slides[i] = {
						title: el.title || el.related.name,
						subtitle: el.subtitle || el.related.subtitle,
						describe: el.describe || el.related.describe,
						price: el.price || el.related.price,
						type_info: el.type_info,
						related: el.related.name,
						image: el.image
					};
				});
			} else {
				$scope.slides[i] = el;
			}
		});
	}

	function loadSlides() {
		loadData($scope, $http, GET_CONTROLLER_ACTION || CONTROLLER_ACTION, function() {
			$scope.$apply();
			concatData();
		});
	}
	loadSlides();


	$scope.products = null;
	$scope.promoproducts = null;

	$scope.$on("products", function(e, data) {
		$scope.products = data;
	});
	$scope.$on("promoproducts", function(e, data) {
		$scope.products = data;
	});


	$scope.$on("view", function(e, data) {

	});
	/* end downloading data */

	// modal download file
	$scope.file_field = "Add photo";
	window.onload = function() {
		var input_file = document.getElementById("upl2"); // input for downloading image-file
		input_file.onchange = function() {
			if(input_file.files[0].name) {
				$scope.file_field = input_file.files[0].name;
				$scope.$apply();
			}
		};
	};



	$scope.edit_obj = {};
	var index_edit_item = null;
	var modal_mode = null;

	$scope.related1 = null;
	$scope.related2 = null;


	$scope.edit = function(index) {

		index_edit_item = index;
		modal_mode = "edit";
		$scope.edit_obj = $scope.data[index];
		$('#modalEditMainslider').modal('show');
	};
	$scope.create = function() {

		index_edit_item = $scope.data.length;
		modal_mode = "create";
		$('#modalEditMainslider').modal('show');
	};

	$scope.save = function() {

		if($scope.edit_obj.type_info) {
			if($scope.edit_obj.type_info == "products") {
				$scope.edit_obj.related_id = $scope.related1;
			} else if($scope.edit_obj.type_info == "promoproducts") {
				$scope.edit_obj.related_id = $scope.related2;
			}
		}
		if(!($scope.edit_obj.type_info && $scope.edit_obj.related_id) || !($scope.edit_obj.title && $scope.edit_obj.image)) {
			alert("There are few empty and important fields!");
			return;
		}

		$scope.data[index_edit_item] = $scope.edit_obj;
		if(modal_mode == "edit") {
			$http.post(CONTROLLER_ACTION, $scope.edit_obj).then(function(data) {
				if(DB_error(data)) return;
				$scope.edit_mainmenu = {};
			});
		} else if(modal_mode == "create") {
			$scope.edit_obj.id = "slide_id_" + $scope.data.length;
			$http.put(CONTROLLER_ACTION, $scope.edit_obj).then(function(data) {
				if(DB_error(data)) return;
				$scope.edit_mainmenu = {};
			});
		}
		index_edit_item = null;
		modal_mode = null;
	};

	$scope.del = function(index) {

		var obj = {
			_id: $scope.data[index]._id
		};
		$http.delete(CONTROLLER_ACTION, obj).then(function(data) {
			if(DB_error(data)) return;
			$scope.data[index] = null;
		});
	};

});