const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const db = require("./database/index.js");
const fs = require("fs");
const https = require("https");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const UserModel = require("./schemas/User.js");
const JournalModel = require("./schemas/Journal.js");
const CommentModel = require("./schemas/Comment.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { getCssColorFromMood } = require("./testColor.js");
const { getMentalHealthTips } = require("./test.js");

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
feed("Feeling down after a tough day at work.")
  .then((results) => {
    const [color, tip] = results;
    console.log(`Color: ${color}, Tip: ${tip}`);
  })
  .catch((error) => {
    console.error(error.message);
  });

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
