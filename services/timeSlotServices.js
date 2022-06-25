const collection = "timeSlots";
const dao = require("../db/baseDao");

const moment = require("moment");

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

module.exports = {
    "getTimeSlotsByDate": getTimeSlotsByDate
}