locApp = angular.module('angTeleApp', ['ui.bootstrap']);

locApp.controller('telemetryController',  ($scope, $http, $uibModal) => {

    let URL_ONG_RACS = "http://localhost:3015/getOngoingRaces";
    let URL_GET_RACE = "http://localhost:3015/getRace/";

    $scope.showNewCircuit = false;
    $scope.lap_times = [];
    $scope.sector_times = [[], [], []];

    $http.get(URL_ONG_RACS).then(response => {
        $scope.races = response.data;
        $scope.races = $scope.races.map(race => {
            race.date = new Date(race.date);
            return race;
        });
        console.log($scope.races);
    });

    $scope.back = () => {
        history.back();
    };

    $scope.reloadRace = () => {
        console.log("reload executed");
        $http.get(URL_GET_RACE + $scope.race._id).then(response => {
            let race = response.data;
            race.cars.forEach(car => {
                car.total_time = 0;
                car.best_lap = {
                    lap: 0,
                    time: 0
                };
                car.laps = [];
                car.lap_times.forEach(lap_time => {
                    let current_lap = 0;
                    lap_time.forEach((time, i) => {
                        car.total_time += time;
                        $scope.sector_times[i].push({
                            car: car,
                            time: time.toFixed(3)
                        });
                        current_lap += time;
                    });
                    if (lap_time.length === 3) {
                        $scope.lap_times.push({
                            car: car,
                            time: current_lap.toFixed(3)
                        });
                        car.laps.push(current_lap.toFixed(3));
                    }
                });
                car.total_time = car.total_time.toFixed(3);
                console.log("total time of car " + car.car.number + " : " + car.total_time);
            });

            // sorting lap times by best
            $scope.lap_times.sort((t1, t2) => {
                if (Math.floor(t1.time) === 0) {
                    return 1;
                }
                if (Math.floor(t2.time) === 0)
                    return -1;
                return t1.time - t2.time;
            });

            // sorting sector times by best
            $scope.sector_times.map(sector_time => sector_time.sort((t1, t2) => {
                if (Math.floor(t1.time) === 0) {
                    return 1;
                }
                if (Math.floor(t2.time) === 0)
                    return -1;
                return t1.time - t2.time;
            }));

            // sorting cars by position according to lap, sector and time
            race.cars.sort((car1, car2) => {
                if (Math.floor(car1.total_time) === 0) {
                    return 1;
                }
                if (Math.floor(car2.total_time) === 0)
                    return -1;
                if (car2.lap_times.length === car1.lap_times.length) {
                    if (car2.lap_times[car2.lap_times.length - 1].length === car1.lap_times[car1.lap_times.length - 1].length) {
                        return car1.total_time - car2.total_time;
                    }
                    return car2.lap_times[car2.lap_times.length - 1].length - car1.lap_times[car1.lap_times.length - 1].length;
                }
                return car2.lap_times.length - car1.lap_times.length;
            });
            $scope.race.cars = race.cars;
            $scope.race.status = race.status;
            console.log(race);
        });
    };
});

