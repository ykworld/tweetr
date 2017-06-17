"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const tweetsRoutes  = express.Router({mergeParams: true});

module.exports = function(DataHelpers) {

  // [tweets] => read all tweets
  tweetsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  // [tweets] => post tweets
  tweetsRoutes.post("/", function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    // check login status
    if (!req.session.user) {
      res.status(403).json({ error: 'unauthorized request'});
      return;
    }

    const avatars = userHelper.generateRandomAvatars();
    const user = {
      name: req.session.user.uname,
      avatars: avatars,
      handle: req.session.user.uid
    }

    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      like_count: 0,
      created_at: Date.now()
    };

    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });
  });

  // [tweets/like] =>  update like count
  tweetsRoutes.put("/like", function(req, res) {
    if (!req.body) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    // check login status
    if (!req.session.user) {
      res.status(403).json({ error: 'unauthorized request'});
      return;
    }

    const newlike = {
      pid: req.body.pid,
      uid: req.session.user.uid
    };
    // 1. check user already click like button
    // 2. insert like data
    // 3. update likecount
    DataHelpers.getLike(newlike, (err, result) => {
      if (!result) {
        DataHelpers.saveLike(newlike, (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            DataHelpers.incLikeCount(newlike.pid, (err) => {
              if (err) {
                res.status(500).json({ error: err.message });
              } else {
                res.status(201).send();
              }
            });
          }
        });
      } else {
        DataHelpers.decLikeCount(newlike.pid, (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            DataHelpers.deleteLike(newlike, (err) => {
              if (err) {
                res.status(500).json({ error: err.message });
              } else {
                res.status(201).send();
              }
            });
          }
        });
      }
    });
  });

  // [tweets/like/:id] => read likes
  tweetsRoutes.get("/like/:id", (req, res) => {
    if (!req.params) {
      res.status(400).json({ error: 'invalid request: no data in params'});
      return;
    }

    const pid = req.params.id;
    DataHelpers.getLikeCount(pid, (err, count) => {
      if (err) {
        res.status(500).json({ error: err.messgae });
      } else {
        res.status(201).send(count);
      }
    });
  });

  // [tweets/like] = > delete like
  tweetsRoutes.delete("/like", function(req, res) {
    if (!req.body) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const like = {
      pid: req.body.uid,
      uid: req.body.pid
    };

    DataHelpers.deleteLike(like, (err) => {
      if (err) {
        res.status(500).json({ error: err.messgae });
      } else {
        res.status(201).send();
      }
    });
  });

  // [tweets] => delete tweet
  tweetsRoutes.delete("/", function(req, res) {
    if (!req.body.pid) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const pid = req.body.pid;
    DataHelpers.deleteTweet(pid, (err) => {
      if (err) {
        res.status(500).json({ error: err.messgae });
      } else {
        res.status(201).send();
      }
    });
  });

  return tweetsRoutes;

}
