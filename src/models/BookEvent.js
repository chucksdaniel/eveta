const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookEventSchema = new Schema(
	{
		event: {
			type: Schema.Types.ObjectId,
			ref: "events",
			required: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			required: true,
		},
	},
	{ timestamps: true }
);

const BookEventModel = mongoose.model("bookEvent", BookEventSchema);
module.exports = BookEventModel;
