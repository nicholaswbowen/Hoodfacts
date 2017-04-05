import * as express from 'express';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import {User} from '../models/User';
import * as moment from 'moment';
import {setCookie} from '../lib/auth';
import Profile from '../models/Profile';
let router = express.Router();

router.get('/auth/currentuser', (req, res, next) => res.json(req.user || {}));

router.post('/auth/register', function(req, res, next) {
  let user = new User();
  user.username = req.body.username;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  user.save(function(err, user) {
    // this is a validation error so 400 bad req
    if (err) return next({message: 'user did not save', error: err});
    let userProfile = new Profile();
    console.log(req.body);
    userProfile.username = req.body.username;
    userProfile.email = req.body.email;
    userProfile.save((err, profile) => {
        if (err) return next({error: err});
        console.log(profile);
        res.status(200).json({ message: 'Registration complete.' });
    });
  });
});

router.post('/auth/login', function(req, res, next) {
  if (!req.body.username && !req.body.password) {
    return res.json({message: 'Please fill out every field'});
  }

  passport.authenticate('local', {session: true}, function(err, user, info) {
    if (err) return next(err);
    if (!user) return res.status(401).json({message: 'failed login'});
    if (user) {
      req.logIn(user, (err) => {
        if (err) return next({message: 'login failed', error: err, status: 500});
        if (user) {
          req.session.save(function (err){
            if (err) return next({message: 'session failed', error: err, status: 500});
            let token = user.generateJWT();
            return setCookie('access_token', token)(req, res, next);
          });
        } else {
          res.json({message: 'please try again.'}).status(500);
        }
      });
    }
  })(req, res, next);
});

router.get('/auth/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next({message: 'still authenticated, please try again.', error: err});
    req.user = null;
    req.session = null;
    req.logout();
    return res.json({isAuthenticated: req.isAuthenticated()});
  });
});

export = router;
