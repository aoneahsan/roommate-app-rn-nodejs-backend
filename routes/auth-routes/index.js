const express = require("express");

const authController = require("./../../controllers/auth-controller");

const router = express.Router();

router.post("/login", authController.login);

router.post("/signup", authController.signup);

router.post("/verify-phone-code", authController.verifyPhone);

router.post("/resend-verify-code", authController.resendVerificationCode);

router.post("/check-login-status", authController.checkLoginStatus);

module.exports = router;
