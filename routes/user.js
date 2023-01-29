const express = require("express");
const router = express.Router();
const userController = require('../controllers/user');

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/forgot-password", userController.postForgotPassword);
router.get("/reset-password/:id/:token", userController.getResetPassword);
router.post("/reset-password/:id/:token", userController.postResetPassword);
module.exports = router;
