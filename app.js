require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
const passport = require('passport');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var bodyparser = require('body-parser');
const flash = require('connect-flash');

var db = require ('./config/db');

// Connecting to the database
db.connect((err) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  } else {
    console.log('Connected to MongoDB');
  }
});
require('dotenv').config();
require('./config/passport')(passport);

var authRoutes = require('./routes/authRoutes');
var adminRoutes = require('./routes/adminRoutes');
var userRoutes = require('./routes/userRoutes');

var app = express();

// view engine setup
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configure session
app.use(session({
  secret: 'your-secret-key', // Change this to a more secure secret
  resave: false,
  saveUninitialized: false,
}));



app.use(flash());

// Passport middleware for handling authentication
app.use(passport.initialize());
app.use(passport.session());

// Global middleware to pass flash messages to views
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error'); // For passport error messages
    next();
});


app.use('/auth', authRoutes);
app.use('/user', userRoutes);


// Redirect root URL to login page
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});


// Protect the /admin route
app.use('/admin', (req, res, next) => {
  if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.redirect('/auth/admin-login');
  }
  next();
}, adminRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
