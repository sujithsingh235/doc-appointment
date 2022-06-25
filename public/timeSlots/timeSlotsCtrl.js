
var timeSlotsController = function ($scope, $http) {

    $scope.workShifts = [];
    $scope.shiftTimeSlotsMap = {};

    getWorkShifts();
    getShiftTimeSlotsMap($scope.selectedDate);

    $scope.$watch("selectedDate", function () {
        getShiftTimeSlotsMap($scope.selectedDate);
    });

    function getShiftTimeSlotsMap(date) {
        $http({
            method: "GET",
            url: "/timeSlots",
            params: { date: date }
        }).then(function (response) {

            let shiftTimeSlotsMap = {};
            response.data.forEach(record => {
                shiftTimeSlotsMap[record.shiftId] = [];
                if (record.timeSlots && record.timeSlots.length > 0) {

                    shiftTimeSlotsMap[record.shiftId] = record.timeSlots;
                    record.timeSlots.forEach(timeSlot => {
                        timeSlot.startTime = moment(timeSlot.startTime).format("hh:mm A");
                        timeSlot.endTime = moment(timeSlot.endTime).format("hh:mm A");
                    });
                }
            });
            $scope.shiftTimeSlotsMap = shiftTimeSlotsMap;

        }, function (err) {
            console.error(err);
        });
    }

    function getWorkShifts() {
        $http({
            method: "GET",
            url: "/workShifts"
        }).then(function (response) {
            $scope.workShifts = response.data;
        }, function (err) {
            console.error(err);
        });
    }
}

timeSlotsController.$inject = ["$scope", "$http"];
var app = angular.module("App");
app.controller("timeSlotsController", timeSlotsController);
