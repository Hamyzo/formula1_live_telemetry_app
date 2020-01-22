locApp = angular.module('angCircApp', ['ui.bootstrap']);

locApp.controller('CircuitsController',  ($scope, $http, $uibModal) => {

    let URL_ALL_CIRS = "http://localhost:3015/getAllCircuits";
    let URL_ADD_CIR = "http://localhost:3015/createCircuit";
    let URL_UPD_CIR = "http://localhost:3015/updateCircuit/";

    $scope.race = {};
    $scope.showNewCircuit = false;

    $http.get(URL_ALL_CIRS).then(response => {
        $scope.circuits = response.data;
        console.log($scope.circuits);
    });

    $scope.updateCircuit = (selectedCircuit) => {
        $scope.selectedCircuit = selectedCircuit;
        console.log($scope.selectedCircuit);
        $scope.open('edit');
    };

    $scope.open = action => {
        $scope.showNewCircuit = true;
        $scope.action = action;
        if (action === "new") {
            $scope.formTitle = "Add";
            $scope.circuit = {};
        } else {
            $scope.formTitle = "Edit";
            $scope.circuit = $scope.selectedCircuit;
        }
    };

    $scope.cancel = () => {
        $scope.showNewCircuit = false
    };

    $scope.newCircuit = (selectedCircuit) => {
        const circuit = selectedCircuit;
        console.log(circuit);
        if ($scope.action === "new") {
            $http.get(URL_ADD_CIR + `?name=${circuit.name}&country=${circuit.country}&lap_distance=${circuit.lap_distance}`).then(response => {
                console.log(response);
            });
        } else {
            $http.get(URL_UPD_CIR + circuit._id + `?name=${circuit.name}&country=${circuit.country}&lap_distance=${circuit.lap_distance}`).then(response => {
                console.log(response);
            });
        }
    };
});

