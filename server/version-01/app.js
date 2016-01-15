var express             = require('express');
var path                = require('path');
var favicon             = require('serve-favicon');
var logger              = require('morgan');
var cookieParser        = require('cookie-parser');
var bodyParser          = require('body-parser');
var crypto              = require('crypto');
var sqlite3             = require('sqlite3');
var db                  = new sqlite3.Database('../database.db');
var passport            = require('passport');
var LocalStrategy       = require('passport-local').Strategy;

var routes              = require('./routes/index');
var radar               = require('./routes/radar');
var newEvent            = require('./routes/newEvent');
var details             = require('./routes/details');
var register            = require('./routes/register');
var attend              = require('./routes/attend');

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
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({ secret: 'endjoyaselves', resave: false, saveUninitialized: false }));


// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

//    Make login variable available in all templates
app.use( function(req, res, next){
      app.locals.login = req.user;
      next();
} );

app.use('/', routes);
app.use('/radar', radar);
app.use('/new', newEvent);
app.use('/details', details);
app.use('/register', register);
app.get('/welcome', function(req,res,next){ res.render('welcome', {title: "Djoya"}); });
app.get('/guide', function(req,res,next){ res.render('guide', {title: "Djoya"}); });
app.get('/impress', function(req,res,next){ res.render('impress', {title: "Djoya"}); });
app.use('/attend', attend);


//    Login
function hashPassword(password, salt) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  hash.update(salt);
  return hash.digest('hex');
}

passport.use(new LocalStrategy(function(username, password, done) {
  db.get('SELECT salt FROM users WHERE username = ?', username, function(err, row) {
    if (!row) return done(null, false);
    var hash = hashPassword(password, row.salt);
    db.get('SELECT username, id FROM users WHERE username = ? AND password = ?', username, hash, function(err, row) {
      if (!row) return done(null, false);
      return done(null, row);
    });
  });
}));

passport.serializeUser(function(user, done) {
  return done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.get('SELECT id, username FROM users WHERE id = ?', id, function(err, row) {
    if (!row) return done(null, false);
    return done(null, row);
  });
});

app.post('/login', passport.authenticate('local', { successRedirect: '/radar',
                                                    failureRedirect: '/login-fail' }));
app.get('/login-fail', function(req,res,next){
      res.render('login-fail', {title: "Djoya"});
} )

app.get('/logout', function(req, res){
      req.logout();
      res.redirect('welcome');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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
