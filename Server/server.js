const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db = require('./database/index.js');
const fs = require('fs');
const https = require('https');
const http = require('http')
const cors = require('cors');
const UserModel = require('./schemas/User.js')
const JournalModel = require('./schemas/Journal.js')
const CommentModel = require('./schemas/Comment.js')
const dotenv = require("dotenv");

// Errors
const {
    BadRequestError,
    DbError,
    MissingIdError,
    NotFoundError,
    InvalidRouteError,
    InvalidCredentialsError } = require('./errors/errorHandling.js')

// Configure enviornment variables
dotenv.config();

// Initialize server
const app = express();
const port = 8080;

// Add middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

// Create server
const server = http.createServer({}, app);

// Async Wrapper Function to handle errors
const asyncWrapper = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            return next(error)
            // res.status(400).json({ errName: error.name, errMsg: error.message })
        }
    }
}

// Next Middleware to handle errors
app.use((err, req, res, next) => {
    if (!err.code) {
        err.code = 500;
    }
    console.log(req.body)
    // Sends detailed error message to client
    res.status(err.code).json({ errName: err.name, errMsg: err.message, errCode: err.code, errStack: err.stack })
    // Sends user friendly error message to client
    res.status(err.code).json({ errName: err.name, errMsg: err.message, errCode: err.code })
})

// Add routes
app.get('/', (req, res) => {
    res.send("/");
});

// Create user
app.post('/api/user/create', asyncWrapper(async (req, res) => {
    const { email } = req.body;

    try {
        const user = await UserModel.findOne({ email: email })

        if(user == undefined){
            user = await UserModel.create({
                email: email
            })    
            console.log(user);
            res.status(200).json(user);
        } else {
            res.status(200).json("User found")
        }
        
    } catch (err) {
        throw new DbError("Cannot create user")
    }
}))

// Find user
app.post('/api/user/find', asyncWrapper(async (req, res) => {
    const { email } = req.body;

    try {
        const user = await UserModel.findOne({ email: email })

        if(user != undefined){
            res.status(200).json(user)
        } else {
            res.status(200).json("User not found")
        }
        
    } catch (err) {
        throw new DbError("Cannot find user")
    }

}))

// Post comment
app.post('/api/comment/create', asyncWrapper(async (req, res) =>  {
    const { userId, journalId, commentText } = req.body;

    try {
        const user = await UserModel.findOne({ _id: userId })

        const journal = await JournalModel.findOne({ _id: journalId})

        const comment = await CommentModel.create({
            author: user.userName,
            commentText: commentText
        })

        console.log(comment);

        user.comments.push(comment._id);
        journal.comments.push(comment._id);

        await user.save();
        await journal.save();

        res.status(200).json(comment);
    } catch (err) {
        throw new DbError("Cannot create comment")
    }

}));

// Get comments by date
app.post('/api/comment/getByDate', asyncWrapper(async (req, res) =>  {
    const { journalId } = req.body;

    try {
        const journal = await JournalModel.findOne({ _id: journalId})

        const commentIds = journal.comments;
        const comments = [];
        for(let i = 0; i < commentIds.length; i++) {
            const comment = await CommentModel.findOne({_id: commentIds[i]})
            comments.push[comment]
        }

        res.status(200).json(comments);
    } catch (err) {
        throw new DbError("Cannot get comments")
    }
}));

// Get comments by likes
app.post('/api/comment/getByLikes', asyncWrapper(async (req, res) =>  {
    const { journalId } = req.body;

    try {
        const journal = await JournalModel.findOne({ _id: journalId})

        const commentIds = journal.comments;
        const comments = [];
        for(let i = 0; i < commentIds.length; i++) {
            const comment = await CommentModel.findOne({_id: commentIds[i]})
            comments.push[comment]
        }

        comments.sort((a, b) => a.likes - b.likes)

        res.status(200).json(comments);
    } catch (err) {
        throw new DbError("Cannot get comments")
    }
}));

// Catch all other routes
app.get('*', asyncWrapper(async (req, res) => {
    throw new Error("Invalid route: please check documentation")
}))

// Next Middleware to handle errors
app.use((err, req, res, next) => {
    if (!err.code) {
        err.code = 500;
    }
    console.log(req.body)
    // Sends detailed error message to client
    res.status(err.code).json({ errName: err.name, errMsg: err.message, errCode: err.code, errStack: err.stack })
    // Sends user friendly error message to client
    //res.status(err.code).json({ errName: err.name, errMsg: err.message, errCode: err.code })
})

server.listen(port, () => {
    console.log(`Example app listening at https://localhost:${port}`);
});