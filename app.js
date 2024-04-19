const bcrypt = require('bcryptjs')
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const connection = require('./config/database');
require('dotenv').config(); // gives access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
const express = require('express');
const indexRouter = require('./routes/index');
const logger = require('morgan');
const MongoStore = require('connect-mongo');
const path = require('path');
const session = require('express-session');
const passport = require('passport');

/* GENERAL SET UP */
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* SESSION SETUP */

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: connection._connectionString,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // Equals 1 day
  }
}));

/* PASSPORT AUTHENTICATION */

require('./config/passport'); // Importing the entire passport config module

app.use(passport.session());

// app.use((req, res, next) => {
//   console.log(req.session);
//   console.log(req.user);
//   next();
// });

/* LOCAL VARIABLES */

app.use((req, res, next) => {
  res.locals.currentUser = req.user; 
  // passport.deserializeUser extracts the data from the "serialized" passport.serializeUser which attach something to the .user property of the request object for use in the rest of the request.
  // with this middleware we can now use "currentUser" variable in all of our views template without manually passing it through all of the controllers in which we need it.
  next();
})

/* ROUTE(S) */

app.use('/', indexRouter);

/* ERROR HANDLERS */

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
