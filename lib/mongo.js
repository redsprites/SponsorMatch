const mongoose = require('mongoose');
const userSchema = require('../models/user');
const blogSchema = require('../models/blog');
const commentSchema = require('../models/comment');
const pw2023Q2Schema = require('../models/pw2023Q2');

const uri1 = "mongodb+srv://test:test@cluster0.ef4gjym.mongodb.net/sponsormatch?retryWrites=true&w=majority";
const uri2 = "mongodb+srv://test:test@cluster0.ef4gjym.mongodb.net/companies?retryWrites=true&w=majority";

async function connect() {
  try {
    const db1 = await mongoose.createConnection(uri1, { useNewUrlParser: true, useUnifiedTopology: true });
    const Blog = db1.model('Blog', blogSchema.obj);
    const User = db1.model('User', userSchema.obj);
    const Comment = db1.model('Comment', commentSchema.obj);
    console.log("Connected to sponsormatch database");

    const db2 = await mongoose.createConnection(uri2, { useNewUrlParser: true, useUnifiedTopology: true });
    const PW_2023_Q2 = db2.model('PW_2023_Q2', pw2023Q2Schema.obj, 'PW_2023_Q2');
    console.log("Connected to companies database");
 

    return { User, Blog, Comment, PW_2023_Q2 };
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

module.exports = { connect };
