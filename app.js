var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require("dotenv");
var cors = require('cors');

dotenv.config({ path: path.join(__dirname, 'config', "config.env") })
require("./config/db")();

var indexRouter = require('./routes/index');
var classRouter = require('./routes/classes');
var studentRouter = require('./routes/students');
var teacherRouter = require('./routes/teachers');
var adminRouter = require('./routes/admin');

var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/classes', classRouter);
app.use('/students', studentRouter);
app.use('/teachers', teacherRouter);
app.use('/admins', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

console.log("Server is now running on port " + process.env.PORT);
module.exports = app;
