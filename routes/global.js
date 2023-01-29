const express = require("express");
const router = express.Router();
const globalController = require('../controllers/global');


// get all blogs
router.get("/", globalController.getAllBlogs);


module.exports = router;
