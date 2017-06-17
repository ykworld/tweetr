"use strict";

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");
const Mongo    = require("mongodb");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insert(newTweet);
      callback(null, true);
    },

    // Delete a tweet from 'db'
    deleteTweet: function(pid, callback) {
      db.collection("tweets").deleteOne({_id: new Mongo.ObjectID(pid)});
      callback(null, true);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      db.collection("tweets").aggregate([{ $lookup: { from: 'likes', localField: '_id', foreignField: 'pid', as: 'likes' } }]).toArray((err, tweets) => {
        if (err) {
          return callback(err);
        }
        callback(null, tweets);
      });
    },

    // Save a user to 'db'
    saveUser: function(newUser, callback) {
      db.collection("users").insert(newUser);
      callback(null, true);
    },

    // Get user by userid
    getUserById: function(uid, callback) {
      db.collection("users").findOne({uid: uid}, (err, item) => {
        callback(err, item);
      });
    },

    // update like data
    incLikeCount: function(pid, callback) {
      db.collection("tweets").update({_id: new Mongo.ObjectID(pid)}, {$inc:{like_count : 1}}, (err) => {
        if (err) {
         callback(err);
        }
        callback(null);
      });
    },

    decLikeCount: function(pid, callback) {
      db.collection("tweets").update({_id: new Mongo.ObjectID(pid)}, {$inc:{like_count : -1}}, (err) => {
        if (err) {
         callback(err);
        }
        callback(null);
      });
    },

    getLikeCount: function(pid, callback) {
      db.collection("tweets").findOne({_id: new Mongo.ObjectID(pid)}, (err, item) => {
        callback(err, item);
      });
    },

    // update like data
    saveLike: function(newLike, callback) {
      newLike.pid = new Mongo.ObjectID(newLike.pid); // convert string type to objectID Type
      db.collection("likes").insert(newLike, (err) => {
        if (err) {
         callback(err);
        }
        callback(null);
      });
    },

    getLike: function(like, callback) {
      db.collection("likes").findOne({uid: like.uid, pid: new Mongo.ObjectID(like.pid)}, (err, item) => {
        callback(err, item);
      });
    },

    // delete like data
    deleteLike: function(like, callback) {
      like.pid = new Mongo.ObjectID(like.pid); // convert string type to objectID Type
      db.collection("likes").deleteOne(like, (err) => {
        if (err) {
         callback(err);
        }
        callback(null);
      });
    }
  };
}
