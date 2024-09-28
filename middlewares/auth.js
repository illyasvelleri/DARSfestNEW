

// Middleware to ensure the user is an admin
function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
        return next();
    }
    res.redirect('/auth/admin/admin-login');
}

module.exports = {
    ensureAdmin
};
