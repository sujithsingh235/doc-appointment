const router = require('express').Router();
const timeSlotServices = require("../services/timeSlotServices");

// Payload
// {
//     "timeSlotId": String,
//     "appointment": {
//         "patientName": String,
//         "contactNumber": String
//     }
// }
router.post('/', async function (req, res) {
    try {
        let result = await timeSlotServices.createAppointment(req.body.timeSlotId, req.body.appointment);
        res.send(true);
    }
    catch (err) {
        res.status(500).send("Something went wrong.");
    }
});

module.exports = router;