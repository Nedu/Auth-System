const routes = require('express').Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const User = require('../models/User');
const secret = 'hdhscuehvuchfudvh';

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

module.exports = routes;