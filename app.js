
//  Simulated mongoose db user lookup call
var User = {
  findOne: function (userDetails, callback) {

    var user = userDetails;

    return callback(null, user);
  }
}

var passport = require('passport')



var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ resave: true, saveUninitialized: false, secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));







passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Configure
passport.use(new (require('passport-cas').Strategy)({
  version: 'CAS3.0',
  ssoBaseURL: 'https://my.monash.edu.au/authentication/cas',
  serverBaseURL: 'http://melts-dev.eng.monash.edu:8002/',
  validateURL: '/serviceValidate'
}, function(login, done) {
  User.findOne({login: login}, function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {message: 'Unknown user'});
    }
    return done(null, user);
  });
}));



app.get('/cas_login', function(req, res, next) {
  passport.authenticate('cas', function (err, user, info) {
    if (err) {
      return next(err);
    }

    if (!user) {
      req.session.messages = info.message;
      return res.redirect('/');
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }

      req.session.messages = '';
      return res.redirect('/home');
    });
  })(req, res, next);
});



function isLoggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/cas_login');
    }
}


app.get('/', function(req, res) {
  res.send('login with: <a href="/cas_login">Monash</a>');
});

app.get('/home', isLoggedIn, function(req, res) {
  res.send('Logged in as: ' + JSON.stringify(req.user));
});


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
