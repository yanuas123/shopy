
app.controller("usersCtrl", function($scope, $http) {
	var CONTROLLER_ACTION = "/adm_users";


	$scope.users = null;
	function loadUsers() {
		loadData($scope, $http, CONTROLLER_ACTION, function() {

		});
	}
	loadUsers();
	$scope.$on("view", function(e, data) {

	});


    $scope.delete = function(index) { // delete user
		var user = $scope.data[index];
		var user_data = {
			_id: user._id
		};

		$http.delete(CONTROLLER_ACTION, user_data).then(function(data) {
			if(DB_error(data)) return;
			delete $scope.data[index];
			$scope.$apply();
		});
    };

});