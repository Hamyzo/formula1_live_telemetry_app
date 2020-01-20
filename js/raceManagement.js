locApp = angular.module('angRaceApp', ['ui.bootstrap']);

locApp.controller('RacesController',  ($scope, $http, $uibModal) => {
	
	let URL_ALL_RACES = "http://localhost:3015/getAllRaces";
	let URL_ALL_CIRS = "http://localhost:3015/getAllCircuits";
	let URL_ADD_RACE = "http://localhost:3015/createRace";

	$scope.races = [];
	$scope.race = {};
	$scope.showNewRace = false;
			
	$http.get(URL_ALL_RACES).then(response => {
		$scope.races =  response.data;
		console.log(response);
    });

	$http.get(URL_ALL_CIRS).then(response => {
		$scope.circuits =  response.data;
		console.log(response);
	});

	$scope.updateRace = () => {
		console.log($scope.selectedRace);
	};

	$scope.open = () => {
		$scope.showNewRace = true
	};

	$scope.cancel = () => {
		$scope.showNewRace = false
	};

	$scope.newRace = () => {
		console.log("race", $scope.race);
		const race = $scope.race;

		$http.get(URL_ADD_RACE + `?country=${race.country}&date=${race.date}&circuit=${race.circuit}&nb_laps=${race.nb_laps}`).then(response => {
			$scope.races =  response.data;
			console.log(response);
		});
	};
});

