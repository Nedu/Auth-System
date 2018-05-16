const routes = require('express').Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('../models/User');
const secret = 'hdhscuehvuchfudvh';

const localStrategy = new LocalStrategy(function(username, password, done) {
  User.findOne({ username })
    .then(user => {
      if (!user) {
        done(null, false);
      } else {
        user
          .validatePassword(password)
          .then(isValid => {
            if (isValid) {
              const { _id, username } = user;
              return done(null, { _id, username }); 
            } else {
              return done(null, false);
            }
          })
          .catch(err => {
            return done(err);
          });
      }
    })
    .catch(err => done(err));
});

// passport global middleware
passport.use(localStrategy);

// passport local middleware
const passportOptions = { session: false };
const authenticate = passport.authenticate('local', passportOptions);

function makeToken(user) {
    const timestamp = new Date().getTime();
    const payload = {
        sub: user._id,
        iat: timestamp,
        username: user.username,
    };
    const options = {
        expiresIn: '24h',
    };

    return jwt.sign(payload, secret, options);
}

routes.post('/register', (req, res) => {
    const { username, password } = req.body;
    const newUser = { username, password };
    const user = new User(newUser);
    user.save().then(user => {
        const token = makeToken(user);
        res.status(201).json({ user, token });
    })
    .catch(err => {
        res.status(500).json(err);
    })
})

routes.post('/login', authenticate, (req, res) => {
    res.status(200).json({ token: makeToken(req.user), user: req.user})
})

module.exports = routes;