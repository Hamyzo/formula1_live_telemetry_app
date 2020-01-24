locApp = angular.module('angTeleApp', ['ui.bootstrap']);

locApp.controller('telemetryController',  ($scope, $http, $uibModal) => {

    let URL_ONG_RACS = "http://localhost:3015/getOngoingRaces";
    let URL_GET_RACE = "http://localhost:3015/getRace/";

    $scope.showNewCircuit = false;
    $scope.best_lap = {
        car: null,
        time: 0
    };

    $http.get(URL_ONG_RACS).then(response => {
        $scope.races = response.data;
        $scope.races = $scope.races.map(race => {
            race.date = new Date(race.date);
            return race;
        });
        console.log($scope.races);
    });

    $scope.reloadRace = () => {
        console.log("reload executed");
        $http.get(URL_GET_RACE + $scope.race._id).then(response => {
            let race = response.data;
            race.cars.forEach(car => {
                car.total_time = 0;
                car.lap_times.forEach(lap_time => {
                    let current_lap = 0;
                    lap_time.forEach(time => {
                        car.total_time += time;
                        current_lap += time;
                    });
                    if ((lap_time.length === 3 && current_lap < $scope.best_lap.time && current_lap !== 0) || $scope.best_lap.time === 0)
                        $scope.best_lap = {
                            car: car,
                            time: current_lap.toFixed(3)
                        };
                });
                car.total_time = car.total_time.toFixed(3);
                console.log("total time of car " + car.car.number + " : " + car.total_time);
            });
            race.cars.sort((car1, car2) => {
                if (Math.floor(car1.total_time) === 0) {
                    return 1;
                }
                else if (Math.floor(car2.total_time) === 0)
                    return -1;
                if (car2.lap_times.length === car1.lap_times.length) {
                    if (car2.lap_times[car2.lap_times.length - 1].length === car1.lap_times[car1.lap_times.length - 1].length) {
                        return car1.total_time - car2.total_time;
                    }
                    return car2.lap_times[car2.lap_times.length - 1].length - car1.lap_times[car1.lap_times.length - 1].length;
                }
                return car2.lap_times.length === car1.lap_times.length;
            });
            $scope.race = race;
            console.log($scope.race);
        });
    };
});

