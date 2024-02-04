const asyncHandler = require("express-async-handler");

exports.addUser_post = asyncHandler(async (req, res, next) => {
	// add users
	return res.send("Not implemented");
});

exports.login_post = asyncHandler(async (req, res, next) => {
	// for logging in
	return res.send("Not implemented");
});
