var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const timeSlotsRouter = require("./routes/timeSlots");
const workShiftsRouter = require("./routes/workShifts");

const connectDB = require("./db/util").connect;

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
connectDB();

app.use("/timeSlots", timeSlotsRouter);
app.use("/workShifts", workShiftsRouter);

module.exports = app;
