const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comment = new Schema({
  commentText: {
    type: String,
    required: true,
    trim: true,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", Comment);
