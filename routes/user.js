const express = require("express");
const router = express.Router();
const userController = require('../controllers/user');


//register a user to the server
router.post("/register", userController.registerUser);

//login a user to the server
router.post("/login", userController.loginUser);

//forgot password functionality for a user
router.post("/forgot-password", userController.postForgotPassword);

//reset the password
router.get("/reset-password/:id/:token", userController.getResetPassword);

//reset the password to the new password
router.post("/reset-password/:id/:token", userController.postResetPassword);

module.exports = router;
