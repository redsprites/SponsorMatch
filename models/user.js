const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String,  required: false, },
  lastName: { type: String,   required: false,  },
  userName: { type: String,   required: true,  unique: true,  },
  email: { type: String,    required: true,    unique: true,  },
  password: {    type: String,    required: true,  },
  internship: {    type: Boolean,    required: false,  },
  blogs: [    { type: mongoose.Schema.Types.ObjectId,  ref: 'Blog', },  ],
  comments: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Comment',  }, ],
});

module.exports = userSchema;
