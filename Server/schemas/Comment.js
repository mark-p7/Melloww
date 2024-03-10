const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comment = new Schema({
  commentText: {
    type: String,
    required: true,
    trim: true,
  },
  authorId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Comment", Comment);
