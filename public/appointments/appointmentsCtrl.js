var appointmentsCtrl = function ($scope, $http) {

    $scope.appointments = [];
    getAppointments($scope.selectedDate);

    $scope.$watch("selectedDate", function () {
        getAppointments($scope.selectedDate);
    });

    function getAppointments(date) {
        $http({
            method: "GET",
            url: "/appointments",
            params: { date: date }
        }).then(function (response) {

            $scope.appointments = response.data;
            $scope.appointments.forEach(appointment => {
                appointment.displayStartTime = moment(appointment.startTime).format("HH:mm");
                appointment.displayEndTime = moment(appointment.endTime).format("HH:mm");
                appointment.startTime = new Date(appointment.startTime);
                appointment.endTime = new Date(appointment.endTime);
            });

            $scope.appointments.sort(function (a, b) {
                return a.startTime > b.startTime;
            });

        }, function (err) {
            console.error(err);
        });
    }
}

appointmentsCtrl.$inject = ["$scope", "$http"];
var app = angular.module("App");
app.controller("appointmentsCtrl", appointmentsCtrl);
