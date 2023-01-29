const express = require("express");
const router = express.Router();
const blogController = require('../controllers/blog');
const checkAuth = require('../middleware/auth');

//view a single blog
router.get("/view/:BlogId", blogController.getBlog);

//create a new blog
router.post("/create", checkAuth, blogController.createBlog);

//edit a blog
router.post("/edit/:BlogId", checkAuth, blogController.editBlog);

//delete a blog
router.delete("/delete/:BlogId", checkAuth, blogController.deleteBlog);


module.exports = router;
