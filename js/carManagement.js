locApp = angular.module('angCarApp', ['ui.bootstrap']);

locApp.controller('CarsController',  ($scope, $http, $uibModal) => {

    let URL_ALL_CARS = "http://localhost:3015/getAllCars";
    let URL_UPD_CAR = "http://localhost:3015/updateCar/";

    $http.get(URL_ALL_CARS).then(response => {
        $scope.cars =  response.data;
        console.log($scope.cars);
    });

    $scope.back = () => {
        history.back();
    };

    $scope.updateCar = (selectedCar) => {
        $scope.selectedCar = selectedCar;
        console.log($scope.selectedCar);
    };

    $scope.cancel = () => {
        $scope.showNewRace = false
    };

    $scope.updateCarData = (selectedCar) => {
        const car = selectedCar;
        console.log(car);
        $http.get(URL_UPD_CAR + car._id + `?team=${car.team}&driver=${car.driver}&manufacturer=${car.manufacturer}&number=${car.number}`).then(response => {
            console.log(response);
        });
    };
});

