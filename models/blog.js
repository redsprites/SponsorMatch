const mongoose = require('mongoose');
const commentSchema = require('./comment');
const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: false },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    comments: [commentSchema],
});

module.exports = blogSchema;
