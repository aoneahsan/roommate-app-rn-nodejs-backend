const express = require("express");

const userController = require("./../../controllers/user-controller");

const router = express.Router();

router.get("/profile", userController.getProfileData);
// router.get("/profile", userController.login);

module.exports = router;
