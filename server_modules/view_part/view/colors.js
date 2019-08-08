
app.controller("colorsCtrl", function($scope, $rootScope, $http) {
	var CONTROLLER_ACTION = "/adm_colors";
	var GET_CONTROLLER_ACTION = "/colors";


	$scope.data = null;
	$scope.$on("colors", function(e, data) {
		$scope.data = data;
	});
	$rootScope.$broadcast("askData");
	$scope.$on("view", function(e, data) {

	});

	$scope.edit_obj = {};
	var index_edit_item = null;


	$scope.create = function() {

		index_edit_item = $scope.data.length;
		$('#modalEditColor').modal('show');
	};

	$scope.save = function() {

		$scope.data[index_edit_item] = $scope.edit_obj;
			$http.put(CONTROLLER_ACTION, $scope.edit_obj).then(function(data) {
				if(DB_error(data)) return;
				$scope.edit_obj = {};
		});
		index_edit_item = null;
	};

});