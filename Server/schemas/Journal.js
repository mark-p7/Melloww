const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  JournalEntry: { type: String, required: true }, // Assuming this is a descriptive field for the journal entry
  EntryId: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() }, // Auto-generate if not provided
  EntryText: { type: String, required: true },
  Date: { type: Date, default: Date.now }, // Automatically set to the current date if not provided
  Title: { type: String, required: true },
  AuthorId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Assuming this references an Author collection
  Emoji: { type: String }, // Optional: include if you want to allow users to associate an emoji with the entry
  Public: { type: Boolean, default: true }, // Default to public if not specified
  CommentID: [{ type: mongoose.Schema.Types.ObjectId }] // Array of ObjectIds referencing Comment documents
});

const JournalModel = mongoose.model('Journal', journalSchema);

module.exports = JournalModel;
