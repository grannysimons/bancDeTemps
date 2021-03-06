require("dotenv").config();
const session  = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require('connect-flash');
const bodyParser = require('body-parser');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('./database');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var profileRouter = require('./routes/profile');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// sessions handler
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  secret: 'some-string',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));


app.use(flash());

app.use(logger('dev'));
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'uploadImages')));

app.use((req, res, next) => {
  app.locals.currentUser = req.session.currentUser;
  // app.locals.profileImg = req.session.profileImg;
  next();
})

// app.use('/', authRouter);

// app.use('/', authRouter)
app.use('/', indexRouter);
app.use('/', authRouter)
app.use('/profile', profileRouter);
app.use('/api', apiRouter);
// app.use('/login', authRouter);
// app.use('/logout', authRouter);
app.use('/auth', authRouter);
app.use('/transaction', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const {userName, password} = req.body;
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  err.message = res.locals.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  if(err.status && err.status == 404)
  {
    res.render('errors/404', { err });
  }
  else
  {
    res.render('errors/500', { err });
  }
});



module.exports = app;
