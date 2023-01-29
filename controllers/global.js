const Blog = require('../schema/Blog');
const limitPerPage = 10;

/**
 * @route GET /home/?pageNo=
 *
 * @access public
 *
 * @description Display 10 blogs per page
 *
 *
 * @returns 
 * 200: A message if blogs are successfully retrieved
 */
exports.getAllBlogs = async (req, res) => {
    const pageNo = req.query.pageNo || 1;
        
    try {

        const blogs = await Blog.find()
            .limit(limitPerPage)
            .skip(limitPerPage * eval(pageNo - 1))

        if (blogs.length) {
            return res.status(200).send({ blogs })
        }
        else return res.status(400).send({ message: "No blogs available corresponding to given page" });
        
    } catch (e) {
        console.log(e);
        res.status(500).send({messgae: " Internal Server Error"})
    }
    
}