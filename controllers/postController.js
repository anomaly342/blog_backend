const asyncHandler = require("express-async-handler");
const Post = require("../models/post");
const Comments = require("../models/comment");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { validationResult, body } = require("express-validator");

exports.allPosts_get = asyncHandler(async (req, res, next) => {
	// get all posts
	const posts = await Post.find({}, { comments: 0 })
		.sort({ created: -1 })
		.populate({
			path: "posted_by",
			select: "username",
		})
		.exec();

	if (posts) {
		res.json(posts);
	} else {
		res.sendStatus(404);
	}
});

exports.post_get = asyncHandler(async (req, res, next) => {
	// get a post
	const post = await Post.find({ _id: req.params.postId })
		.populate({
			path: "comments",
			populate: {
				path: "posted_by",
				select: "username",
			},
		})
		.populate({
			path: "posted_by",
			select: "username",
		})
		.exec();

	// check if array is empty
	if (post.length) {
		res.json(post);
	} else {
		res.sendStatus(404);
	}
});

exports.createPost_post = [
	body("title")
		.escape()
		.isLength({ min: 1, max: 60 })
		.withMessage("Invalid title length"),
	body("body")
		.escape()
		.isLength({ max: 1000 })
		.withMessage("Invalid body length"),
	asyncHandler(async (req, res, next) => {
		// create a post
		const result = validationResult(req);
		const requestedToken = req.token;

		if (!requestedToken) {
			// if token is null, it goes here
			return res.sendStatus(401);
		}

		if (!result.isEmpty()) {
			return res.json(result.array());
		}

		jwt.verify(
			requestedToken,
			process.env.PRIVATE_KEY,
			async (err, decodedUser) => {
				if (err) {
					// in case of invalid syntax
					return res.sendStatus(401);
				}

				if (decodedUser.role === "admin") {
					// user has admin rights
					const post = new Post({
						title: req.body.title,
						body: req.body.body,
						comments: [],
						posted_by: decodedUser._id,
						created: new Date(),
					});

					const savedPost = await post.save();

					if (savedPost) {
						res.json(savedPost);
					} else {
						// If it fails to upload to database
						res.sendStatus(500);
					}
				} else {
					// user doesn't have admin rights
					res.send("Posting is only reserved for admins");
				}
			}
		);
	}),
];

exports.createComment_post = asyncHandler(async (req, res, next) => {
	// create a comment
	return res.send("Not implemented");
});

exports.editPost_put = asyncHandler(async (req, res, next) => {
	// edit a post
	return res.send("Not implemented");
});

exports.removePost_remove = asyncHandler(async (req, res, next) => {
	// remove a post and comments within the post
	return res.send("Not implemented");
});

exports.removeComment_remove = asyncHandler(async (req, res, next) => {
	// remove a comment
	return res.send("Not implemented");
});
