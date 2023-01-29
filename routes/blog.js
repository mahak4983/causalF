const express = require("express");
const router = express.Router();
const blogController = require('../controllers/blog');
const checkAuth = require('../middleware/auth');
router.post("/create", checkAuth, blogController.createBlog);
router.post("/edit/:BlogId", checkAuth, blogController.editBlog);
router.delete("/delete/:BlogId", checkAuth, blogController.deleteBlog);



module.exports = router;
