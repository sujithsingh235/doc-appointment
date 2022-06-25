const router = require('express').Router();

router.get("/", async function (req, res) {
    console.log(req.query.date);
    res.send(["a", "b"]);
});

module.exports = router;