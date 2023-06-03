const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/commentController');
const isAuthenticated = require('../../middleware/isAuthenticated');

// Get all comments for a blog post
router.get('/blog/:blogId', commentController.getCommentsForBlog);

// Get a comment by ID
router.get('/:id', commentController.getCommentById);

// Create a new comment for a blog post
router.post('/blog/:blogId', isAuthenticated, commentController.createCommentForBlog);

// Update a comment by ID
router.put('/:id', isAuthenticated, commentController.updateCommentById);

// Delete a comment by ID
router.delete('/:id', isAuthenticated, commentController.deleteCommentById);

module.exports = router;
