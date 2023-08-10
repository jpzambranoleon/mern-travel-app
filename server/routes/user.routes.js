const router = require("express").Router();
const userController = require("../controllers/user.controller");

// Update user
router.put("/update/:userId", userController.updateUser);

router.put("/changePassword/:userId", userController.changePassword);

router.get("/", userController.getUser);

module.exports = router;
