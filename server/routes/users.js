const routes = require('express').Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const User = require('../models/User');
const secret = 'hdhscuehvuchfudvh';

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
};

const jwtStrategy = new JwtStrategy(jwtOptions, function (payload, done) {
    User.findById(payload.sub)
        .then(user => {
            if (user) {
                done(null, user); 
            } else {
                done(null, false);
            }
        })
        .catch(err => {
            done(err);
        });
});

// passport global middleware
passport.use(jwtStrategy);

// passport local middleware
const passportOptions = { session: false };
const protected = passport.authenticate('jwt', passportOptions);

routes.get('/users', protected, (req, res) => {
    User.find().then(users => {
        res.status(200).json(users);
    }).catch(err => {
        res.status(500).json(err);
    })
})

module.exports = routes;