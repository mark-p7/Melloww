const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    min: 3,
    max: 29,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  dateJoined: {
    type: Date,
    default: Date.now,
  },
  journalIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Journal",
    },
  ],
  likedJournals: [
    {
      type: Schema.Types.ObjectId,
      ref: "Journal",
    },
  ],
  commentIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

module.exports = mongoose.model("Users", User);
