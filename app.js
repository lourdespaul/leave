var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('express-flash');
var mongoose = require('./config/db');
var passport = require('passport');
var hbs = require('hbs');
var moment = require('moment');

var index = require('./routes/index');
var users = require('./routes/users');
var teachers = require('./routes/teachers');
var auth = require('./routes/auth');
var leave = require('./routes/leave-request');
var principal = require('./routes/principal');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

require('./config/passport')();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/node_modules/materialize-css/dist')));
app.use(express.static(path.join(__dirname, '/node_modules/jquery/dist')));

app.use('/', index);
app.use('/users',isLoggedIn, users);
app.use('/teachers',teachers);
app.use('/', auth);
app.use('/leave',isLoggedIn,leave);
app.use('/principal',isLoggedIn,isPrincipal,principal);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/login');
}

function isPrincipal(req, res, next) {
    if(req.user.isPrincipal){
        return next();
    }else {
        res.redirect('/leave')
    }
}

hbs.registerHelper('user', function () {
    if(req.user){
        return req.user;
    }
    else{
        return null;
    }
});

hbs.registerHelper('formatTime', function (date, format) {
    var mmnt = moment(date);
    return mmnt.format(format);
});

hbs.registerHelper('uppercase', function (str) {
    return str.toUpperCase();
});


module.exports = app;
