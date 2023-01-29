const Blog = require('../schema/Blog');
const User = require('../schema/User');

exports.createBlog = async (req, res) => {
    console.log(req.userInfo._id);
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

exports.editBlog = async (req, res) => {
    const blogId = req.params.BlogId;
    const {
        heading, content
    } = req.body;
    try {
        const blogData = await Blog.findById(blogId,{userId:1});
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