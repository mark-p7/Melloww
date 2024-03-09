const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Journal = new Schema({
  entryText: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  emoji: {
    type: String,
    trim: true,
    default: "",
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  commentIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

module.exports = mongoose.model("Journal", Journal);
