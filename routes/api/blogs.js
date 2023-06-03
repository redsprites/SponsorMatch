const express = require('express');
const router = express.Router();
const blogController = require('../../controllers/blogController');
const isAuthenticated = require('../../middleware/isAuthenticated');


//     router.get('/', blogController.getBlogs);
//     router.get('/:id', blogController.getBlog);
//     router.post('/', isAuthenticated, blogController.createBlog);
//     router.put('/:id', isAuthenticated, blogController.updateBlog);
//     router.delete('/:id', isAuthenticated, blogController.deleteBlog);

// module.exports = router;
  

router.get('/', blogController.getBlogs);

// get a blog post by ID
router.get('/:id', blogController.getBlog);

// Create a new blog post
router.post('/', isAuthenticated, blogController.createBlog);

// Update a blog post by ID
router.put('/:id', isAuthenticated, blogController.updateBlog);

// Delete a blog post by ID
router.delete('/:id', isAuthenticated, blogController.deleteBlog);

module.exports = router;
