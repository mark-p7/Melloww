const mongoose = require('mongoose');
const fs = require('fs');
const UserModel = require("../schemas/User.js");
const JournalModel = require("../schemas/Journal.js");
const CommentModel = require("../schemas/Comment.js")
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.connect(MONGO_URI, options).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

const db = mongoose.connection;

module.exports = db;