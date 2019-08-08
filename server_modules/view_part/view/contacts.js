
app.controller("contactsCtrl", function($scope, $http) {
	var CONTROLLER_ACTION = "/adm_contacts";
	var GET_CONTROLLER_ACTION = "/contacts";


	$scope.data = null;
	function loadContacts() {
		$http.get(GET_CONTROLLER_ACTION || CONTROLLER_ACTION).then(function(data) {
			if(DB_error(data)) return;
			$scope.data = data.data[0];
			getCountries();
		});
	}
	loadContacts();
	$scope.$on("view", function(e, data) {

	});

	$scope.countries = null;
	$scope.selectedCountry = "Greece";
	function getCountries() {
	$http.get("https://restcountries.eu/rest/v2/all").then(function(data) {
		if(DB_error(data)) return;
			$scope.countries = data.data;
		});
	}



	$scope.save = function() { // edit contacts

		$http.post(CONTROLLER_ACTION, $scope.data).then(function(data) {
			if(DB_error(data)) return;
		});
	};

});