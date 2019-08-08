
app.controller("categoriesCtrl", function($scope, $rootScope, $http) {
	var CONTROLLER_ACTION = "/adm_categories";
	var GET_CONTROLLER_ACTION = "/categories";


	$scope.categories = [];
	$scope.brands = [];
	$scope.$on("categories", function(e, data) {
		console.log("cat");
		console.dir(data);
		data.forEach(function(el, i) {
			if(el.name == "categories") {
				$scope.categories = el;
			} else if(el.name == "brands") {
				$scope.brands = el;
			}
		});
	});
	$rootScope.$broadcast("askData");
	$scope.$on("view", function(e, data) {

	});

	$scope.edit_obj = {};
	var category_type = null;
	var index_edit_item = null;
	var modal_mode = null;


	$scope.create_category = function() {

		category_type = "category";
		if($scope.categories.items) {
			index_edit_item = $scope.categories.items.length;
		} else index_edit_item = 0;
		modal_mode = "create";
		$('#modalEditCategory').modal('show');
	};
	$scope.create_brand = function() {

		category_type = "brand";
		if($scope.brands.items) {
			index_edit_item = $scope.brands.items.length;
		} else $scope.brands.items = 0;
		modal_mode = "create";
		$('#modalEditCategory').modal('show');
	};

	$scope.save = function() {

		var obj = null;
		if(category_type == "category") {
			$scope.categories.items[index_edit_item] = $scope.edit_obj;
			obj = {
				id: $scope.categories._id,
				items: $scope.edit_obj
			};
		} else if(category_type == "brand") {
			$scope.brands.items[index_edit_item] = $scope.edit_obj;
			obj = {
				id: $scope.brands._id,
				items: $scope.edit_obj
			};
		}
		console.log($scope.edit_obj);
		$http.post(CONTROLLER_ACTION, obj).then(function(data) {
				if(DB_error(data)) return;
				$scope.edit_obj = {};
		});
		category_type = null;
		index_edit_item = null;
		modal_mode = null;
	};

});