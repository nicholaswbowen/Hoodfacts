import * as express from 'express';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import {User} from '../models/User';
import Profile from '../models/Profile';
let router = express.Router();

router.get('/users/:username', function(req, res, next) {
  User.findOne(req.params.name).select('-passwordHash -salt')
    .exec((e, user) => {
      if (e) return next({message: 'Could not find user.', error: e});
      let u = user.hasOwnProperty('username') ? user : {};
      return res.json(u);
  });
});
router.delete('/users/:username', (req, res, next) => {
    if (req.params.username === 'admin') return res.status(401).json
    ({message: 'Yeah right! Admins can not be deleted!!!'});
    User.remove ({username: req.params.username}, (err) => {
      if (err) return next({message: 'error deleting', error: err});
        return res.status(200).json({message: 'Deleted!'});
    });
});
router.get('/users', (req, res, next) => {
  User.find().then((users) => {
    res.json(users);
  }).catch ((err) => {
    return next({message: 'can not list users', error: err});
  });
});

export = router;
