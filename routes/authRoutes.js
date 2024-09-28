const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');
const { ensureAuthenticated, ensureAdmin } = require('../middlewares/auth');

// User registration routes
router.get('/register', authController.renderRegister);
router.post('/register', authController.registerUser);

// User login routes
router.get('/login', authController.renderLogin);
router.post('/login', passport.authenticate('local', {
    successRedirect: '/user/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true
}));



// Admin login page
router.get('/admin-login', (req, res) => {
    res.render('auth/admin-login');
});

// // Handle Admin login POST request
// router.post('/admin-login', passport.authenticate('local', {
//     successRedirect: '/admin/dashboard',
//     failureRedirect: '/auth/admin-login',
//     failureFlash: true
// }));

// Handle Admin login POST request manually
router.post('/admin-login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err); // Handle error
        }
        if (!user) {
            // If no user is found, return to login with an error message
            return res.render('auth/admin-login', { errorMessage: 'Invalid credentials' });
        }
        // If user is found, log them in manually
        req.login(user, (err) => {
            if (err) {
                return next(err); // Handle error during login
            }
            // Render the dashboard after successful login
            return res.render('admin/dashboard', { user });
        });
    })(req, res, next);
});



// // Admin login routes (admin credentials are checked against .env)
// router.get('/admin/login', authController.renderAdminLogin);
// router.post('/admin/login', authController.adminLogin);

// Logout (common for both admin and user)
router.get('/logout', authController.logout);

module.exports = router;
