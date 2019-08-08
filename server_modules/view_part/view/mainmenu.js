
app.controller("mainmenuCtrl", function($scope, $http) {
	var CONTROLLER_ACTION = "/adm_mainmenu";
	var GET_CONTROLLER_ACTION = "/mainmenu";


	$scope.data = null;
	function loadMainmenu() {
		loadData($scope, $http, GET_CONTROLLER_ACTION || CONTROLLER_ACTION, function() {

		});
	}
	loadMainmenu();
	$scope.$on("view", function(e, data) {

	});

	$scope.edit_mainmenu = {
		title: "",
		link: ""
	};
	var index_edit_item = null;
	var modal_mode = null;


	$scope.edit = function(index) {

		index_edit_item = index;
		modal_mode = "edit";
		$scope.edit_mainmenu = $scope.data[index];
		$('#modalEditMainmenu').modal('show');
	};
	$scope.create = function() {

		index_edit_item = $scope.data.length;
		modal_mode = "create";
		$('#modalEditMainmenu').modal('show');
	};

	$scope.save = function() {

		$scope.data[index_edit_item] = $scope.edit_mainmenu;
		if(modal_mode == "edit") {
			$http.post(CONTROLLER_ACTION, $scope.edit_mainmenu).then(function(data) {
				if(DB_error(data)) return;
				$scope.edit_mainmenu = {
					title: "",
					link: ""
				};
			});
		} else if(modal_mode == "create") {
			$http.put(CONTROLLER_ACTION, $scope.edit_mainmenu).then(function(data) {
				if(DB_error(data)) return;
				$scope.edit_mainmenu = {
					title: "",
					link: ""
				};
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