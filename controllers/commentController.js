const { ObjectId } = require('mongodb');
const Comment = require('../models/comment');

// Function to create a new comment for a blog post
exports.createCommentForBlog = async (req, res) => {
    try {
        const { author, content } = req.body;
        const blogId = req.params.blogId;
        const newComment = new Comment({
            author,
            content,
            blogId
        });

        const savedComment = await newComment.save();

        res.status(201).json({
            success: true,
            message: 'Comment created successfully',
            comment: savedComment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the comment'
        });
    }
};

// Function to get all comments for a blog post
exports.getCommentsForBlog = async (req, res) => {
    const blogId = req.params.blogId;

    // Check if the id is a valid ObjectId
    if (!ObjectId.isValid(blogId)) {
        res.status(400).json({ error: 'Invalid id' });
        return;
    }

    try {
        const comments = await Comment.find({ blogId });
        res.status(200).json({ success: true, comments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching comments' });
    }
};

// Function to get a comment by ID
exports.getCommentById = async (req, res) => {
    const id = req.params.id;

    // Check if the id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid id' });
        return;
    }

    try {
        const comment = await Comment.findById(id);
        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }
        res.status(200).json(comment);
    } catch (error) {
        console.error(`Error retrieving comment: ${error}`);
        res.status(500).json({ error: `Error retrieving comment: ${error.message}` });
    }
};

// Function to update a comment by ID
exports.updateCommentById = async (req, res) => {
    const id = req.params.id;
    const { author, content } = req.body;

    // Check if the id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid id' });
        return;
    }

    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { author, content },
            { new: true }
        );

        if (!updatedComment) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Comment updated successfully',
            comment: updatedComment,
        });
    } catch (error) {
        console.error(`Error updating comment: ${error}`);
        res.status(500).json({ error: `Error updating comment: ${error.message}` });
    }
};

// Function to delete a comment by ID
exports.deleteCommentById = async (req, res) => {
    const id = req.params.id;

    // Check if the id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid id' });
        return;
    }

    try {
        const deletedComment = await Comment.findByIdAndRemove(id);

        if (!deletedComment) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully',
            comment: deletedComment,
        });
    } catch (error) {
        console.error(`Error deleting comment: ${error}`);
        res.status(500).json({ error: `Error deleting comment: ${error.message}` });
    }
};
