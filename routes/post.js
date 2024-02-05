const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.get("/", postController.allPosts_get);
router.get("/:postId", postController.post_get);

router.post("/", postController.createPost_post);
router.post("/:postId/comments", postController.createComment_post);

router.put("/:postId", postController.editPost_put);
router.delete("/:postId", postController.removePost_remove);
router.delete(
	"/:postId/comments/:commentId",
	postController.removeComment_remove
);

module.exports = router;
