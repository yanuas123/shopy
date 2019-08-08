
app.controller("ordersCtrl", function($scope, $http) {
	var CONTROLLER_ACTION = "/adm_orders";



	/* downloading data */

	$scope.data = null;
	function loadOrders() {
		loadData($scope, $http, CONTROLLER_ACTION, function(data) {
			$scope.data.forEach(function(el, i) {
				if(el.user_data && el.user_data.related_user) {
					$http.get("/adm_users?u=" + el.user_data.related_user).then(function(data2) {
						if(DB_error(data2)) return;
						$scope.data[i].user_data.related_user = data2.data;
					});
				}
			});
		});
	}
	loadOrders();

	$scope.$on("view", function(e, data) {

	});
	/* end downloading data */



	$scope.close = function(index) {

		var obj = {
			_id: $scope.data[index]._id,
			closed: true,
			product_data: $scope.data[index].product_data
		};
		$http.post(CONTROLLER_ACTION, obj).then(function(data) {
			if(DB_error(data)) return;
			$scope.data[index].closed = true;
			$scope.data[index].product_data.forEach(function(el, i) {
				var obj_qty = {
					id: el.product_id,
					size: el.size,
					color: el.color,
					qty: -el.qty,
					saled: el.qty
				};
				if(el.prod_type == "products") {
					$http.post("/adm_qty", obj_qty).then(function(data) {
						if(DB_error(data)) return;
					});
				} else if(el.prod_type == "promoproducts") {
					$http.post("/adm_promoqty", obj_qty).then(function(data) {
						if(DB_error(data)) return;
					});
				}
			});
		});
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