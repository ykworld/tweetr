"use strict";

// Basic express setup:
const PORT           = 8080;
const MONGODB_URI    = "mongodb://localhost:27017/tweeter";
const express        = require("express");
const bodyParser     = require("body-parser");
const methodOverride = require("method-override");
const sassMiddleware = require('node-sass-middleware');
const path           = require('path');
const MongoClient    = require("mongodb").MongoClient;
const cookieSession  = require('cookie-session');
const app            = express();

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.use(sassMiddleware({
    src: path.join(__dirname, '../public/sass'),
    dest: path.join(__dirname, '../public/styles'),
    debug: true,
    outputStyle: 'extended',
    indentedSyntax: true,
    prefix:  '/styles'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride('_method'));

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }

  // The `data-helpers` module provides an interface to the database of tweets.
  // This simple interface layer has a big benefit: we could switch out the
  // actual database it uses and see little to no changes elsewhere in the code
  // (hint hint).
  //
  // Because it exports a function that expects the `db` as a parameter, we can
  // require it and pass the `db` parameter immediately:
  const DataHelpers = require("./lib/data-helpers.js")(db);

  // The `tweets-routes` module works similarly: we pass it the `DataHelpers` object
  // so it can define routes that use it to interact with the data layer.
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);
  const usersRoutes = require("./routes/users")(DataHelpers);
  // Mount the tweets routes at the "/tweets" path prefix:
  app.use("/tweets", tweetsRoutes);
  app.use("/users", usersRoutes);

  app.get("/checksession", (req, res) => {
    res.send(req.session.user);
  });

  app.get("/destroysession", (req, res) => {
    req.session = null;
    res.send(null);
  });

  //Start the application after the database connection is ready
  app.listen(PORT, () => {
    console.log("Example app listening on port " + PORT);
  });
});


