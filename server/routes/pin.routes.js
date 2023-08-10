const router = require("express").Router();
const pinController = require("../controllers/pin.controller");

router.post("/create", pinController.createPin);

router.delete("/delete/:pinId", pinController.deletePin);

router.get("/getAll", pinController.getAllPins);

module.exports = router;
