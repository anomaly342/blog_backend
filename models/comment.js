const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
	content: { type: String, required: true, max: 500 },
	posted_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Comment", commentSchema);
