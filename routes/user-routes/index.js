const express = require("express");

const userController = require("./../../controllers/user-controller");

const router = express.Router();

router.get("/profile", userController.getProfileData);

router.post("/profile", userController.updateProfile);

router.post("/upload-image", userController.uploadImage);

router.get("/users-list", userController.getUsersList);

module.exports = router;
