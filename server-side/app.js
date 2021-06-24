var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var session = require('express-session')
// for debug: SET DEBUG=express-session
var socket_io = require('./modules/socket_io' ); /// socket-io modul - init and send

// var passport = require('passport');
// var LocalStrategy = require('passport-local');
// const bcrypt = require('bcrypt');

// var cors = require('cors'); // for CORS (!)
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var vacationsRouter = require('./routes/vacations');
var vacsFollowRouter = require('./routes/vacs_follow');
var reportRouter = require('./routes/report');

// TODO (App Server Side):
// 1. add is_su_reply() to auten.js
// 2. add server side log
// 3. Update NodeJS (to after 14.2.0)
// 4. Use Optional Chaining => [ if (arg1?.arg2?.foo .. ) ]

var app = express();
// app.use(cors()); // use CORS when necessary(!)

// to use when needed - Develop Only !
/*
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});
*/

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    key: 'user_sid',
    name: 'SESSION_NAME',
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,    
    cookie: { sameSite: true, httpOnly: true, secure: false, maxAge: 60000 * 120} // = 2 hours // 30 * 86400 * 1000 = 30 days
}))

if (!socket_io.init_socket (app)) /// init Socket IO and listen to port
{
  console.log("Server Init of Socket IO - Can't Init. Some Error Occured !");
} 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/vacations', vacationsRouter);
app.use('/vacs_follow', vacsFollowRouter);
app.use('/report', reportRouter);

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
