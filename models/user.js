const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
	username: {
		type: String,
		unique: true,
		min: 5,
		max: 13,
		validate: {
			validator: (v) => {
				return /^([\w-]+)$/.test(v);
			},
		},
	},
	password: {
		type: String,
		min: 6,
		max: 128,
		required: true,
	},
	role: { type: String, required: true, enum: ["guest", "admin"] },
});

userSchema.pre("save", function (next) {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(this.password, salt, (err, hash) => {
			this.password = hash;
			return next();
		});
	});
});

module.exports = mongoose.model("User", userSchema);
