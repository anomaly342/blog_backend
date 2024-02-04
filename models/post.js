const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
	title: { type: String, min: 1, max: 60, required: true },
	body: { type: String, max: 1000 },
	comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
	created: { type: Date, required: true },
});

module.exports = mongoose.model("Post", postSchema);
