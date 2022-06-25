const workShiftServices = require("../services/workShiftServices");

const router = require('express').Router();

router.get("/", async function (req, res) {
    try {
        let result = await workShiftServices.getAll(req.query.date);
        res.send(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong.");
    }
});

module.exports = router;