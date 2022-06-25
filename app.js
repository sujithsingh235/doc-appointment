var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const timeSlotsRouter = require("./routes/timeSlots");

const connectDB = require("./db/util").connect;

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
connectDB();

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/timeSlots", timeSlotsRouter);

module.exports = app;
