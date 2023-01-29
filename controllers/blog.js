const Blog = require('../schema/Blog');
const User = require('../schema/User');


/**
 * @route POST /blog/create
 *
 * @access private
 *
 * @description Authenticated users Create Blogs
 *
 * @param heading heading of the blog
 * @param content content of the blog
 *
 * @returns A message if blog is successfully created
 */
exports.createBlog = async (req, res) => {
    
    const {
        heading, content
    } = req.body;

    const loggedInUserID = req.userInfo._id;

   
     
    try {

        const userCreatingBlog = await User.findById(loggedInUserID)

        const blogData = {
            heading,
            content,
            createdAt: Date.now(),
            userId: loggedInUserID
        }
        const newBlog = new Blog(blogData);
        const newBlogData = await newBlog.save();
        
        
        userCreatingBlog.blogsCreated.push(newBlogData._id);
      
        await userCreatingBlog.save();
        res.status(200).send({ message: "Blog created Successfully" });

    } catch (e) {
        return res.status(500).send({ message: 'Internal server error!' });

    }

}

/**
 * @route POST /blog/edit/:BlogId
 *
 * @access private
 *
 * @description Authenticated users Edit Blogs
 *
 * @param heading heading of the blog
 * @param content content of the blog
 *
 * @returns 
 * 200: A message if blog is successfully edited
 * 400: If unauthorized user tries to edit
 * 404: If blog is not found
 * 500: Server Error
 */

exports.editBlog = async (req, res) => {
    const blogId = req.params.BlogId;
    const {
        heading, content
    } = req.body;
    try {
        const blogData = await Blog.findById(
            blogId, 
            { userId: 1 }
        );
        if (!blogData) {
            return res.status(404).send({ message: "Blog not found" });
        }
        if (blogData.userId.toString() !== req.userInfo._id) {
           return res.status(400).send({ error: "You dont have access to change this blog" });
        }

        const updatedBlogData = await Blog.updateOne(
            {
                _id: blogId,
            },
            {
                $set: {
                    heading,
                    content
                },
            },
            
        );

        res.status(200).send({ message: "successfully edited" });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Internal server error!' });

    }
   

}

/**
 * @route DELETE /blog/delete/:BlogId
 *
 * @access private
 *
 * @description Authenticated users Delete Blogs
 *
 * @param heading heading of the blog
 * @param content content of the blog
 *
 * @returns 
 * 200: A message if blog is successfully deleted
 * 400: If unauthorized user tries to delete
 * 404: If blog is not found
 * 500: Server Error
 */
exports.deleteBlog = async (req, res) => {
    const blogId = req.params.BlogId;
    try {

        const blogData = await Blog.findById(
            blogId,
            { userId: 1 }
        );
        if (!blogData) {
            return res.status(404).send({ message: "Blog not found" });
        }
        if (blogData.userId.toString() !== req.userInfo._id) {
            return res.status(400).send({ error: "You dont have access to change this blog" });
        }

        await Blog.findByIdAndDelete(blogId);
         
        await User.updateOne(
            { _id: req.userInfo._id },
            {
                $pull: {
                    'blogsCreated':
                    {
                       _id:blogId
                    }
                }
            }
        )
       return res.status(200).send({ message: "Successfully Deleted" });
        
    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Internal server error!' });


    }
}

/**
 * @route GET /blog/view/:BlogId
 *
 * @access public
 *
 * @description view a single blog
 *
 * @returns 
 * 200: A message if blog is successfully retrieved
 * 404: If blog is not found
 * 500: Server Error
 */
exports.getBlog = async (req, res) => {
    const blogId = req.params.BlogId;
    try {

        const blogData = await Blog.findById(blogId);
        if (!blogData) {
            return res.status(404).send({ message: "Blog not found" });
        }

        return res.status(200).send({ message: "Blog Retrieved", blogData });

    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: 'Internal server error!' });


    }
}

