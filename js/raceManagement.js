locApp = angular.module('angRaceApp', ['ui.bootstrap']);

locApp.controller('RacesController',  ($scope, $http, $uibModal) => {
	
	let URL_ALL_RACES = `http://localhost:${port}/getAllRaces`;
	let URL_ALL_CIRS = `http://localhost:${port}/getAllCircuits`;
	let URL_ALL_CARS = `http://localhost:${port}/getAllCars`;
	let URL_ADD_RACE = `http://localhost:${port}/createRace`;
	let URL_UPD_RACE = `http://localhost:${port}/updateRace/`;

	$scope.races = [];
	$scope.race = {};
	$scope.selectedCars = [];
	$scope.showNewRace = false;
			
	$http.get(URL_ALL_RACES).then(response => {
		$scope.races = response.data;
		$scope.races = $scope.races.map(race => {
			race.date = new Date(race.date);
			return race;
		});
		console.log($scope.races);
    });

	$http.get(URL_ALL_CIRS).then(response => {
		$scope.circuits = response.data;
		console.log($scope.circuits);
	});

	$http.get(URL_ALL_CARS).then(response => {
		$scope.cars =  response.data;
		console.log($scope.cars);
	});

	$scope.updateRace = () => {
		$scope.selectedCars = $scope.selectedRace.cars.map(car => car.car._id);
		console.log($scope.selectedRace);
		console.log($scope.selectedCars);
	};

	$scope.back = () => {
		history.back();
	};

	$scope.open = action => {
		delete $scope.selectedRace.circuit.$$hashKey;
		$scope.showNewRace = true;
		$scope.action = action;
		if (action === "new") {
			$scope.formTitle = "Add";
		} else {
			$scope.formTitle = "Edit";
			$scope.race = $scope.selectedRace;
		}
	};

	$scope.cancel = () => {
		$scope.showNewRace = false
	};

	$scope.changeSelectedCars = (selectedCars) => {
		$scope.selectedCars = selectedCars
	};

	$scope.newRace = () => {
		let race = $scope.race;
		console.log("selected cars:", $scope.selectedCars);
		race.cars = $scope.selectedCars.map(car => ({
			car,
			lap_times: [],
			status: "pending"
		}));
		if ($scope.action === "new") {
			$http.get(URL_ADD_RACE + `?country=${race.country}&date=${race.date}&circuit=${race.circuit}&nb_laps=${race.nb_laps}`).then(response => {
				console.log(response);
			});
		} else {
			console.log(race);
			$http.get(URL_UPD_RACE + race._id + `?country=${race.country}&date=${race.date}&circuit=${race.circuit._id || race.circuit}&nb_laps=${race.nb_laps}&cars=${JSON.stringify(race.cars)}`).then(response => {
				console.log(response);
			});
		}
	};
});

