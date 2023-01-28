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