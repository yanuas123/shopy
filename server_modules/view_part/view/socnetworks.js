
app.controller("socnetworksCtrl", function($scope, $http) {
	var CONTROLLER_ACTION = "/adm_socnetworks";
	var GET_CONTROLLER_ACTION = "/socnetworks";


	$scope.data = null;
	function loadSocnetworks() {
		loadData($scope, $http, GET_CONTROLLER_ACTION || CONTROLLER_ACTION, function() {

		});
	}
	loadSocnetworks();
	$scope.$on("view", function(e, data) {

	});

	$scope.edit_network = null;
	var index_edit_item = null;


	$scope.edit = function(index) {

		index_edit_item = index;
		$scope.edit_network = $scope.data[index];
		$('#modalEditSocnetworks').modal('show');
	};

	$scope.save = function() {

		$scope.data[index_edit_item] = $scope.edit_network;
		$http.post(CONTROLLER_ACTION, $scope.edit_network).then(function(data) {
			if(DB_error(data)) return;
		});
		index_edit_item = null;
	};

});