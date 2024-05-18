require("dotenv").config();
const mongoose = require("mongoose");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const KEY = process.env.KEY;
const app = express();

const verifyToken = async (req, res, next) => {
	// const authorization = req.cookies.token;
	// if (!authorization) {
	// 	req.token = null;
	// 	return next();
	// }

	const token = req.cookies.token;

	if (typeof token === "undefined") {
		req.token = null;
	}
	req.token = token;
	return next();
};

mongoose.connect(KEY).catch((err) => {
	console.log(err);
});
app.use(express.static(__dirname + "/public"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(cors());
app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "https://localhost:3000");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
	res.setHeader("Access-Control-Allow-Credentials", true);
	next();
});
app.use(verifyToken);

app.use("/posts", postRouter);
app.use("/u", userRouter);
app.get("*", (req, res, next) => {
	return res.sendStatus(404);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
