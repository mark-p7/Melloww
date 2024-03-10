const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  EntryId: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() }, // Auto-generate if not provided
  EntryText: { type: String, required: true },
  Date: { type: Date, default: Date.now }, // Automatically set to the current date if not provided
  Title: { type: String, required: true },
  AuthorId: { type: String, required: true }, // Assuming this references an Author collection
  Emoji: { type: String }, // Optional: include if you want to allow users to associate an emoji with the entry
  Public: { type: Boolean, default: true }, // Default to public if not specified
  CommentID: {default: [], type: [String]}, // Array of ObjectIds referencing Comment documents
  Color: {
    default: '#CCCCCC',
    type: String
  },
  likesCount: {
    type: Number,
    default: 0,
  },
});

const JournalModel = mongoose.model('Journal', journalSchema);

module.exports = JournalModel;
