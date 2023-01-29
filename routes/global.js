const express = require("express");
const router = express.Router();
const globalController = require('../controllers/global');

router.get("/", globalController.getAllBlogs);


module.exports = router;
