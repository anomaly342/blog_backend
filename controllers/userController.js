const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.addUser_post = asyncHandler(async (req, res, next) => {
	// add users
	return res.send("Not implemented");
});

exports.login_post = [
	body("password").trim().escape(),
	body("username")
		.trim()
		.custom(async (v, { req }) => {
			const user = await User.findOne({ username: v }).exec();
			if (!user) {
				throw new Error("Invalid username");
			}

			const plainPassword = req.body.password;
			const match = await bcrypt.compare(plainPassword, user.password);

			if (!match) {
				throw new Error("Invalid password");
			}

			req.user = user;
		}),
	asyncHandler(async (req, res, next) => {
		// for logging in
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return res.json(result.array());
		}

		const { password: a, ...auth } = req.user.toJSON(); // Remove a password field from the object
		jwt.sign(auth, process.env.PRIVATE_KEY, (err, token) => {
			if (err) {
				return res.sendStatus(403);
			} else {
				return res.json(token);
			}
		});
	}),
];
