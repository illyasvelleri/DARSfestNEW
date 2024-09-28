const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User'); // Assuming a User model
require('dotenv').config();

module.exports = function(passport) {
    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
                // If admin logs in
                return done(null, { id: 'admin', username: 'admin', isAdmin: true });
            }

            // Check regular users
            const user = await User.findOne({ username });
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (password !== user.password) {  // Assuming no bcrypt for now
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        if (id === 'admin') {
            done(null, { id: 'admin', username: 'admin', isAdmin: true });
        } else {
            // Fetch user from DB if needed for regular users
            User.findById(id, (err, user) => {
                done(err, user);
            });
        }
    });
};
