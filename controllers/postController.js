const asyncHandler = require("express-async-handler");

exports.allPosts_get = asyncHandler(async (req, res, req) => {
	// get all posts
	return res.send("Not implemented");
});

exports.post_get = asyncHandler(async (req, res, req) => {
	// get a post
	return res.send("Not implemented");
});

exports.createPost_post = asyncHandler(async (req, res, req) => {
	// create a post
	return res.send("Not implemented");
});

exports.createComment_post = asyncHandler(async (req, res, req) => {
	// create a comment
	return res.send("Not implemented");
});

exports.editPost_put = asyncHandler(async (req, res, req) => {
	// edit a post
	return res.send("Not implemented");
});

exports.removePost_remove = asyncHandler(async (req, res, req) => {
	// remove a post and comments within the post
	return res.send("Not implemented");
});

exports.removeComment_remove = asyncHandler(async (req, res, req) => {
	// remove a comment
	return res.send("Not implemented");
});
