locApp = angular.module('angTeleApp', ['ui.bootstrap']);

locApp.controller('telemetryController', ($scope, $http, $uibModal) => {

    let URL_ONG_RACS = `http://localhost:${port}/getOngoingRaces`;
    let URL_GET_RACE = `http://localhost:${port}/getRace/`;

    $scope.showNewCircuit = false;
    $scope.lap_times = [];
    $scope.lap_times_matrix = [];
    $scope.sector_times = [[], [], []];
    $scope.car_positions = [];

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

    $scope.getColor = car => {
        console.log(`color: #${car.car.color}`);
        return {"color": "#" + car.car.color}
    };

    $scope.reloadRace = () => {
        let lap_times_matrix = [];
        let car_positions = [];
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
                car.lap_times.forEach((lap_time, il) => {
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
                        if (lap_times_matrix[il])
                            lap_times_matrix[il].push({
                                car: car,
                                time: current_lap.toFixed(3)
                            });
                        else
                            lap_times_matrix.push([{
                                car: car,
                                time: car.total_time.toFixed(3)
                            }]);
                        $scope.lap_times.push({
                            car: car,
                            time: current_lap.toFixed(3)
                        });
                        car.laps.push(current_lap.toFixed(3));
                    }
                });
                car.total_time = car.total_time.toFixed(3);
                if (car.lap_times[car.lap_times.length - 1])
                    car.sector_indexes = [
                        car.lap_times[car.lap_times.length - 1].length === 1 ? car.lap_times.length - 1 : car.lap_times.length - 2,
                        car.lap_times[car.lap_times.length - 1].length === 2 ? car.lap_times.length - 1 : car.lap_times.length - 2,
                        car.lap_times[car.lap_times.length - 1].length === 3 ? car.lap_times.length - 1 : car.lap_times.length - 2,
                    ];
                console.log("laps of car " + car.car.number + " : " + car.laps);
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


            // creating a matrix of positions for each driver and each lap
            /*
            $scope.lap_times_matrix:
            laps: [
                times: [

                ]
            ]
             */

            // first we sort the times inside each lap by best
            lap_times_matrix.forEach(lap_times => {
                lap_times.sort((t1, t2) => {
                    if (Math.floor(t1.time) === 0) {
                        return 1;
                    }
                    if (Math.floor(t2.time) === 0)
                        return -1;
                    return t2.time - t1.time;
                });
            });

            // then we create a car position matrix by lap
            /*
            $scope.car_positions:
            cars: [
                pos: [

                ]
            ]
             */
            car_positions = race.cars.map(car => {
                let positions = [];
                lap_times_matrix.forEach((lap, i) => {
                    const idx = lap.findIndex(time => time.car === car);
                    if (idx !== -1)
                        positions.push(idx + 1);
                });
                return positions;
            });


            $scope.lap_times_matrix = lap_times_matrix;
            $scope.car_positions = car_positions;

            console.log($scope.sector_indexes);

            console.log(race);
        });
    };
});

