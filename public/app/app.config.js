angular
    .module('App')
    .controller("mainController", function ($scope) {
        $scope.selectedDate = new Date(moment().format("YYYY-MM-DD"));
    }).
    config(['$routeProvider',
        function config($routeProvider) {
            $routeProvider.
                when('/timeSlots', {
                    templateUrl: "timeSlots/timeSlots.html",
                    controller: "timeSlotsCtrl"
                }).
                when('/appointments', {
                    templateUrl: "appointments/appointments.html",
                    controller: "appointmentsCtrl"
                }).
                otherwise('/timeSlots');
        }
    ]);