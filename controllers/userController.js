const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.addUser_post = [
	body("username")
		.isLength({ min: 5, max: 13 })
		.withMessage("Too few or too many characters")
		.matches(/^([\w-]+)$/)
		.withMessage("Invalid username")
		.custom(async (v) => {
			const user = await User.findOne({ username: v }).exec();
			if (user) {
				throw new Error("This username already exists!");
			}
		}),
	body("password")
		.trim()
		.isLength({ min: 6, max: 13 })
		.matches(/^([\w-]+)$/)
		.withMessage("Invalid password")
		.escape(),

	asyncHandler(async (req, res, next) => {
		// add users
		const result = validationResult(req);

		if (!result.isEmpty()) {
			return res.status(403).json(result.array());
		}

		const user = new User({
			username: req.body.username,
			password: req.body.password,
			role: "guest",
		});

		const savedUser = await user.save();
		if (!savedUser) {
			return res.sendStatus(403);
		}

		const auth = savedUser.toJSON(); // Remove a password field from the object
		jwt.sign(
			auth,
			process.env.PRIVATE_KEY,
			{ expiresIn: "4d" },
			(err, token) => {
				if (err) {
					return res.sendStatus(403);
				} else {
					console.log(savedUser);
					return res
						.cookie("token", token, {
							path: "/",
							httpOnly: true,
							secure: true,
							domain: ".cloudvista.dev",
							expires: new Date(Date.now() + 96 * 3600000),
						})
						.send("Suscess");
				}
			}
		);
	}),
];

exports.login_post = [
	body("password").trim().escape(),
	body("username")
		.trim()
		.custom(async (v, { req }) => {
			const user = await User.findOne({ username: v }).exec();
			if (!user) {
				throw new Error("Wrong username or password");
			}

			const plainPassword = req.body.password;
			const match = await bcrypt.compare(plainPassword, user.password);

			if (!match) {
				throw new Error("Wrong username or password");
			}

			req.user = user;
		}),
	asyncHandler(async (req, res, next) => {
		// for logging in
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return res.status(401).json(result.array());
		}

		const auth = req.user.toJSON(); // Remove a password field from the object
		jwt.sign(auth, process.env.PRIVATE_KEY, (err, token) => {
			if (err) {
				return res.sendStatus(403);
			} else {
				return res
					.cookie("token", token, {
						path: "/",
						httpOnly: true,
						secure: true,
						domain: ".cloudvista.dev",
						expires: new Date(Date.now() + 96 * 3600000),
					})
					.send("Suscess");
			}
		});
	}),
];

exports.loggedin_get = asyncHandler(async (req, res, next) => {
	const token = req.token;
	console.log(token);
	if (!req.token) {
		return res.sendStatus(401);
	}

	jwt.verify(token, process.env.PRIVATE_KEY, async (err, decodedUser) => {
		if (err) {
			// invalid syntax
			return res.sendStatus(401);
		} else {
			delete decodedUser.password;
			return res.status(202).json(decodedUser);
		}
	});
});

exports.logout_get = asyncHandler(async (req, res, next) => {
	res
		.clearCookie("token", { domain: ".cloudvista.dev", path: "/" })
		.sendStatus(202);
});
