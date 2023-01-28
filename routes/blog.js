const express = require("express");
const router = express.Router();
const blogController = require('../controllers/blog');
const checkAuth = require('../middleware/auth');
router.post("/create", checkAuth, blogController.createBlog);


module.exports = router;
