
var timeSlotsController = function ($scope, $http) {
    $scope.timeSlots = getTimeSlots($scope.selectedDate);

    function getTimeSlots(date) {
        $http({
            method: "GET",
            url: "/timeSlots",
            params: { date: date }
        }).then(function (response) {
            return response.data;
        }, function (err) {
            console.log(err);
        });
    }
}

timeSlotsController.$inject = ["$scope", "$http"];
var app = angular.module("App");
app.controller("timeSlotsController", timeSlotsController);
