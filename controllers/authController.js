require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Render user registration page
exports.renderRegister = (req, res) => {
    res.render('auth/register');
};

// Register a new user
exports.registerUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
        });
        await newUser.save();
        res.redirect('/auth/login');
    } catch (err) {
        res.redirect('/auth/register');
    }
};

// Render user login page
exports.renderLogin = (req, res) => {
    res.render('auth/login');
};

// Render admin login page
exports.renderAdminLogin = (req, res) => {
    res.render('auth/admin-login');
};

// Handle admin login with credentials from .env
exports.adminLogin = (req, res) => {
    const { username, password } = req.body;
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (username === adminUsername && password === adminPassword) {
        req.login({ isAdmin: true }, (err) => {
            if (err) {
                return res.redirect('/auth/admin-login');
            }
            return res.redirect('/admin/dashboard');
        });
    } else {
        res.redirect('/auth/admin-login');
    }
};

// Logout
exports.logout = (req, res) => {
    req.logout();
    res.redirect('/auth/login');
};
