// import express
const express = require("express");
// import morgan for logging
const logger = require("morgan");
// import mongoose for noSql interation
const mongoose = require("mongoose");
// import compression for request compression
const compression = require("compression");

// PORT
const PORT = process.env.PORT || 8080;

// create app object as express singleton
const app = express();

// assign app singleton to use morgon logger
app.use(logger("dev"));

// assign app singleton to use request compression
app.use(compression());

// app singleton middleware that converts http requests to json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// assign app singleton to load static files in public folder
app.use(express.static("public"));

// if deployed, use the deployed database. Otherwise use the local database
const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost/budget";

// use mongoose to connect to the budget noSql database
mongoose.connect(MONGODB_URI);

// routes to use
app.use(require("./routes/api.js"));

// assign app singleton to listen for requests on indicated port
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});