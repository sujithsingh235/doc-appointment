const timeSlotServices = require("../services/timeSlotServices");

const router = require('express').Router();

router.get("/", async function (req, res) {
    try {
        let result = await timeSlotServices.getTimeSlotsByDate(req.query.date);
        res.send(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong.");
    }
});

module.exports = router;