const collection = "timeSlots";
const dao = require("../db/baseDao");

const moment = require("moment");
const ObjectId = require("mongodb").ObjectId;

function createTimeSlot(timeSlot) {
    return new Promise(async (resolve, reject) => {
        try {
            timeSlot.startTime = new Date(timeSlot.startTime);
            timeSlot.endTime = new Date(timeSlot.endTime);
            timeSlot.shiftId = new ObjectId(timeSlot.shiftId);
            timeSlot.appointment = null;

            await dao.create(collection, timeSlot);
            resolve(true);
        }
        catch (err) {
            reject(err);
        }
    });
}

function getTimeSlotsByDate(date) {
    return new Promise(async (resolve, reject) => {
        try {
            // start and end time of the given date
            let startTime = moment(date).startOf("day").toDate();
            let endTime = moment(date).endOf("day").toDate();

            let pipeline = [
                {
                    "$match": { "startTime": { $gte: startTime, $lte: endTime } }
                },
                { $sort: { "startTime": 1 } },
                {
                    $group: {
                        "_id": "$shiftId",
                        "timeSlots": {
                            $push: {
                                "startTime": "$startTime",
                                "endTime": "$endTime"
                            }
                        }
                    }
                },
                {
                    $project: {
                        "_id": 0,
                        "shiftId": "$_id",
                        "timeSlots": "$timeSlots"
                    }
                }
            ];

            let timeSlots = await dao.aggregate(collection, pipeline);
            resolve(timeSlots);
        }
        catch (err) {
            reject(err);
        }
    });
}

function createAppointment(timeSlotId, appointment) {
    return new Promise(async (resolve, reject) => {
        try {
            let filter = { _id: new ObjectId(timeSlotId) };
            let detailsToUpdate = {
                $set: { appointment: appointment }
            };
            let result = await dao.updateOne(collection, filter, detailsToUpdate);
            resolve(result);
        }
        catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    "getTimeSlotsByDate": getTimeSlotsByDate,
    "createTimeSlot": createTimeSlot,
    "createAppointment": createAppointment
}