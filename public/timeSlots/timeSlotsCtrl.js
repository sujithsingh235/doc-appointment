var timeSlotsCtrl = function ($scope, $http, $timeout) {

    $scope.workShifts = [];
    // workShift ==> timeSlots
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
                        timeSlot.displayStartTime = moment(timeSlot.startTime).format("HH:mm");
                        timeSlot.displayEndTime = moment(timeSlot.endTime).format("HH:mm");
                        timeSlot.startTime = new Date(timeSlot.startTime);
                        timeSlot.endTime = new Date(timeSlot.endTime);
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

    $scope.setEnvToAddSlot = function (shiftId) {

        $scope.addSlotForm.startTime.$setUntouched();
        $scope.addSlotForm.endTime.$setUntouched();

        $scope.newTimeSlot = {
            "shiftId": shiftId,
            "startTime": null,
            "endTime": null,
        }
        $("#addTimeSlot").modal("show");
    }

    $scope.addTimeSlot = function () {

        $scope.addSlotForm.startTime.$setTouched();
        $scope.addSlotForm.endTime.$setTouched();
        if ($scope.addSlotForm.$invalid) {
            return;
        }

        let selectedDate = moment($scope.selectedDate).format("YYYY-MM-DD");
        let dateTimeFormat = "YYYY-MM-DD HH:mm";

        let startTime = moment($scope.newTimeSlot.startTime).format("HH:mm");
        startTime = moment(selectedDate + " " + startTime, dateTimeFormat);
        $scope.newTimeSlot.startTime = startTime.toDate();

        let endTime = moment($scope.newTimeSlot.endTime).format("HH:mm");
        endTime = moment(selectedDate + " " + endTime, dateTimeFormat);
        $scope.newTimeSlot.endTime = endTime.toDate();

        let valid = isNewSlotTimingsValid(startTime, endTime);
        if (!valid) {
            return;
        }

        $http.post("/timeSlots", $scope.newTimeSlot).then(function (response) {
            getShiftTimeSlotsMap($scope.selectedDate);
            $("#addTimeSlot").modal("hide");
        }, function (err) {
            console.error(err);
        });
    }

    function isNewSlotTimingsValid(startTime, endTime) {

        let selectedDate = moment($scope.selectedDate).format("YYYY-MM-DD");
        let dateTimeFormat = "YYYY-MM-DD HH:mm";

        let workShift = $scope.workShifts.find(shift => shift._id === $scope.newTimeSlot.shiftId);
        let shiftStartTime = moment(selectedDate + " " + workShift.startTime, dateTimeFormat);
        let shiftEndTime = moment(selectedDate + " " + workShift.endTime, dateTimeFormat);

        // startTime should be inside the shift timing range
        if (!startTime.isBetween(shiftStartTime, shiftEndTime, undefined, '[]')) {
            $scope.addSlotForm.startTime.$setValidity("range", false);
            $timeout(function () {
                $scope.addSlotForm.startTime.$setValidity("range", true);
            }, 3000);
            return false;
        }

        // endTime should be inside the shift timing range
        if (!endTime.isBetween(shiftStartTime, shiftEndTime, undefined, '[]')) {
            $scope.addSlotForm.endTime.$setValidity("range", false);
            $timeout(function () {
                $scope.addSlotForm.endTime.$setValidity("range", true);
            }, 3000);
            return false;
        }

        // endTime should be greater than startTime
        if (startTime.isAfter(endTime)) {
            showValidationErrorMsg("Start time must be greater than end time.");
            return false;
        }

        // Slot time should be 30 min
        let _30min = 30 * 60 * 1000;
        if (endTime.diff(startTime) !== _30min) {
            showValidationErrorMsg("The time slot should be 30 minutes.");
            return false;
        }

        // new slot timings should not overlap with existing slots.
        let existingTimeSlots = $scope.shiftTimeSlotsMap[workShift._id];
        if (existingTimeSlots && existingTimeSlots.length > 0) {
            let overLappingSlot = existingTimeSlots.find(slot => {
                if ((startTime.toDate() < slot.startTime && endTime.toDate() <= slot.startTime) ||
                    (startTime.toDate() >= slot.endTime && endTime.toDate() > slot.endTime)) {
                    return false;
                }
                else {
                    return true;
                }
            });

            if (overLappingSlot) {
                let errMsg = `Given timings overlap with existing slot ${overLappingSlot.displayStartTime} - ${overLappingSlot.displayEndTime}.`;
                showValidationErrorMsg(errMsg);
                return false;
            }
        }


        return true;
    }

    function showValidationErrorMsg(msg) {
        $scope.validationError = true;
        $scope.validationErrorMsg = msg;
        $timeout(function () {
            $scope.validationError = false;
        }, 3000);
    }
}

timeSlotsCtrl.$inject = ["$scope", "$http", "$timeout"];
var app = angular.module("App");
app.controller("timeSlotsCtrl", timeSlotsCtrl);
