"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const usersRoutes   = express.Router();
const bcrypt        = require('bcrypt');

module.exports = function(DataHelpers) {

  usersRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, users) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(users);
      }
    });
  });

  usersRoutes.post("/login", function(req, res) {
    if (!req.body) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const uid = req.body.uid;

    // 1. check user exist
    // 2. If user not exist response error
    // 3. or login processing
    DataHelpers.getUserById(uid, (err, user) => {
      if (user == null)
      {
        res.status(403).json({ error: 'User ID does not exists.'})
        return;
      } else {
        if (bcrypt.compareSync(req.body.pwd, user.password)) {
          req.session.user = user;
          res.redirect('/');
          return;
        } else {
          res.status(403).json({ error: 'Password not found.'});
          return;
        }
      }
    })
  });

  usersRoutes.post("/", function(req, res) {
    if (!req.body) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const uid = req.body.uid;

    // 1. check user exist
    // 2. If user exist response error
    // 3. or save user to db
    DataHelpers.getUserById(uid, (err, user) => {
      if (user !== null)
      {
        res.status(409).json({ error: 'User ID already exists.'})
        return;
      } else {
        let hashed_password = bcrypt.hashSync(req.body.pwd, 10);

        const user = {
          uid: uid,
          uname: req.body.uname,
          password: hashed_password,
          created_at: Date.now()
        };

        DataHelpers.saveUser(user, (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
             //create new user
            req.session.user = user;
            res.status(201).send();
          }
        });
      }
    })
  });

  return usersRoutes;

}
