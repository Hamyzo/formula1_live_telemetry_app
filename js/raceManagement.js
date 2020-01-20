locApp = angular.module('angCustApp', []);

locApp.controller('CustomersListController',  function($scope, $http) {
	
	let URL_ALL_CUST = "http://localhost:3015/getAllCustomers";
    
	$scope.customers = [];
			
	$http.get(URL_ALL_CUST).then(function(response) {
		console.log("Hello");
		$scope.customers =  response.data;
		console.log(response);
    });

	$scope.updateCustomer = function() {
		console.log($scope.selectedCustomer);
		$scope.parcels = $scope.selectedCustomer.parcels;
	}
});

