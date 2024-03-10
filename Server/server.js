const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const db = require("./database/index.js");
const http = require("http");
const cors = require("cors");
const UserModel = require("./schemas/User.js");
const JournalModel = require("./schemas/Journal.js");
const CommentModel = require("./schemas/Comment.js");
const dotenv = require("dotenv");
const { getCssColorFromMood } = require("./ai/generateColor.js");
const { getMentalHealthTips } = require("./ai/generateTip.js");

// Errors
const {
  BadRequestError,
  DbError,
  MissingIdError,
  NotFoundError,
  InvalidRouteError,
  InvalidCredentialsError,
} = require("./errors/errorHandling.js");

// Configure enviornment variables
dotenv.config();

// Initialize server
const app = express();
const port = 8080;

// Add middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Create server
const server = http.createServer({}, app);

// Async Wrapper Function to handle errors
const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      return next(error);
      // res.status(400).json({ errName: error.name, errMsg: error.message })
    }
  };
};

// Next Middleware to handle errors
app.use((err, req, res, next) => {
  if (!err.code) {
    err.code = 500;
  }
  console.log(req.body);
  // Sends detailed error message to client
  res.status(err.code).json({
    errName: err.name,
    errMsg: err.message,
    errCode: err.code,
    errStack: err.stack,
  });
  // Sends user friendly error message to client
  res
    .status(err.code)
    .json({ errName: err.name, errMsg: err.message, errCode: err.code });
});

// Add routes
app.get("/", (req, res) => {
  res.send("/");
});

function extractNickname(email) {
    return email.split('@')[0];
}

// Create a user
const createUser = async (email) => {
    try {
        const newUser = new UserModel({ username: email, email: email });
        await newUser.save();
        return newUser;
    } catch (error) {
        throw error;
    }
};

// Find a user, if not found create a user
app.post('/user', asyncWrapper(async (req, res) => {
    const { identifier } = req.body;
    let user = await UserModel.findOne({ email: identifier });
    if (!user) {
        user = await createUser(extractNickname(identifier));
    }

    res.json(user);
}));

// Update name of user
app.post('/user/updateName', asyncWrapper(async (req, res) => {
    const { identifier, username } = req.body;
    let user = await UserModel.findOne({ email: identifier });
    if (!user) {
        throw new NotFoundError("User not found")
    }
    user.username = username;
    await user.save();
    res.status(201).json(user);
}));

// Post comment
app.post('/api/comment/create', asyncWrapper(async (req, res) => {
    const { userId, journalId, commentText } = req.body;

    try {
        const user = await UserModel.findOne({ _id: userId })

        const journal = await JournalModel.findOne({ _id: journalId })

        const comment = await CommentModel.create({
            authorId: userId,
            author: user.username,
            commentText: commentText
        })

        user.commentIds.push(comment._id);
        journal.CommentID.push(comment._id);

        await user.save();
        await journal.save();

        res.status(200).json(comment);
    } catch (err) {
        throw new DbError("Cannot create comment")
    }

}));

// Get comments by date
app.post('/api/comment/getByDate/:id', asyncWrapper(async (req, res) => {
    try {
        const journal = await JournalModel.findById(req.params.id)

        if (!journal) {
            return
        }

        const commentIds = journal.CommentID;
        const comments = [];
        for (let i = 0; i < commentIds.length; i++) {
            const comment = await CommentModel.findOne({ _id: commentIds[i] })
            comments.push(comment)
        }

        res.status(200).json(comments);
    } catch (err) {
        throw new DbError("Cannot get comments")
    }
}));

// Get comments by likes
app.get('/api/comment/getByLikes/:id', asyncWrapper(async (req, res) => {
    try {
        const journal = await JournalModel.findById(req.params.id)

        const commentIds = journal.CommentID;
        const comments = [];
        for (let i = 0; i < commentIds.length; i++) {
            const comment = await CommentModel.findOne({ _id: commentIds[i] })
            comments.push(comment)
        }

        comments.sort((a, b) => a.likes - b.likes)

        res.status(200).json(comments);
    } catch (err) {
        throw new DbError("Cannot get comments")
    }
}));

// Increase likes Comment
app.post('/api/comment/like', asyncWrapper(async (req, res) => {
    try {
        const user = await UserModel.findById(req.body.userId);
        const comment = await CommentModel.findById(req.body.commentId);

        if (!comment || !user) {
            return res.status(404).send("Comment or User not found")
        }

        if (comment.usersWhoLiked == undefined) {
            comment.usersWhoLiked = [];
            await comment.save();
        }

        if (comment.usersWhoLiked.includes(req.body.userId)) {
            comment.usersWhoLiked = comment.usersWhoLiked.filter((id) => id !== req.body.userId);
            comment.likes--;
        } else {
            comment.usersWhoLiked.push(req.body.userId);
            comment.likes++;
        }

        await comment.save();
        return res.status(200).json(comment);
    } catch (err) {
        throw new DbError("Cannot like comment")
    }

}));

// Increase likes Journal
app.post('/api/journal/like', asyncWrapper(async (req, res) => {
    try {
        const user = await UserModel.findById(req.body.userId);
        const journal = await JournalModel.findById(req.body.journalId);

        if (!journal || !user) {
            return res.status(404).send("Journal or User not found")
        }

        if (user.likedJournals && user.likedJournals.includes(req.body.journalId)) {
            journal.Likes--;
            user.likedJournals = user.likedJournals.filter((id) => id != req.body.journalId);
        } else {
            journal.Likes++;
            user.likedJournals.push(req.body.journalId);
        }

        await journal.save();
        await user.save();
        return res.status(200).json(journal);
    } catch (err) {
        throw new DbError("Cannot like comment")
    }
}));

//  Get all journals
app.get('/journals', asyncWrapper(async (req, res) => {
    const journals = await JournalModel.find({ Public: true });
    res.json(journals);
}));

// Randomly select a journal
app.get('/journals/random', asyncWrapper(async (req, res) => {
    const journals = await JournalModel.find();
        // Shuffle array using the Fisher-Yates (Durstenfeld) shuffle algorithm
        for (let i = journals.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [journals[i], journals[j]] = [journals[j], journals[i]]; // Swap elements
        }
    const publicJournals = [];
    for(let i = 0; i < journals.length; i++) {
        if(journals[i].Public){
            publicJournals.push(journals[i])
        }
    }
    res.json(publicJournals);
}));

app.post('/journals/user', asyncWrapper(async (req, res) => {
    const journals = await JournalModel.find();
    const userJournals = [];
    for(let i = 0; i < journals.length; i++) {
        if(journals[i].authorId == req.body.userId){
            userJournals.push(journals[i])
        }
    }
    res.json(userJournals);
}));

// journals by date
app.get('/journals/date', asyncWrapper(async (req, res) => {
    const journals = await JournalModel.find().sort( { 'Date' : -1 } );
    const publicJournals = [];
    for(let i = 0; i < journals.length; i++) {
        if(journals[i].Public){
            publicJournals.push(journals[i])
        }
    }
    //for loop here
    res.json(publicJournals);
}));

// Get public journals
app.get('/journals/public', asyncWrapper(async (req, res) => {
    const journals = await JournalModel.find();
    const publicJournals = [];
    for(let i = 0; i < journals.length; i++) {
        if(journals[i].Public){
            publicJournals.push(journals[i])
        }
    }
    res.json(publicJournals);
}));

// Get a specific journal by ID
app.get('/journals/:id', asyncWrapper(async (req, res) => {
    const journal = await JournalModel.findById(req.params.id);
    if (!journal) {
        return res.status(404).send('Journal not found');
    }
    res.json(journal);
}));

//  Create new journal entry
app.post('/journals', asyncWrapper(async (req, res) => {
    const journal = new JournalModel(req.body);
    await journal.save();
    res.status(201).send(journal);
}));

//   Update an existing journal entry
//   not tested
app.put('/journals/:id', asyncWrapper(async (req, res) => {
    const journal = await JournalModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!journal) {
        return res.status(404).send('Journal not found');
    }
    res.json(journal);
}));

//  Delete a journal entry
app.delete('/journals/:id', asyncWrapper(async (req, res) => {
    const journal = await JournalModel.findByIdAndDelete(req.params.id);
    if (!journal) {
        return res.status(404).send('Journal not found');
    }
    res.status(204).send();
}));




//generate color and tip based on
async function feed(journal) {
  try {
    const colorPromise = getCssColorFromMood(journal);
    const tipPromise = getMentalHealthTips(journal);

    const color = await colorPromise;
    const tipResult = await tipPromise;

    return [color, tipResult];
  } catch (error) {
    throw new Error(`Error in feed function: ${error.message}`);
  }
}

// Usage example
// feed("Feeling down after a tough day at work.")
//   .then((results) => {
//     const [color, tip] = results;
//     console.log(`Color: ${color}, Tip: ${tip}`);
//   })
//   .catch((error) => {
//     console.error(error.message);
//   });

// Catch all other routes
app.get(
  "*",
  asyncWrapper(async (req, res) => {
    throw new Error("Invalid route: please check documentation");
  })
);

// Next Middleware to handle errors
app.use((err, req, res, next) => {
  if (!err.code) {
    err.code = 500;
  }
  console.log(req.body);
  // Sends detailed error message to client
  res.status(err.code).json({
    errName: err.name,
    errMsg: err.message,
    errCode: err.code,
    errStack: err.stack,
  });
  // Sends user friendly error message to client
  //res.status(err.code).json({ errName: err.name, errMsg: err.message, errCode: err.code })
});

server.listen(port, () => {
  console.log(`Example app listening at https://localhost:${port}`);
});
