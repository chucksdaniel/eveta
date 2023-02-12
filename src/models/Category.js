const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema(
	{
		name: {
			type: String,
			require: true,
		},
		noOfEvent: {
			type: Number,
			default: 0,
		},
		imgUrl: { type: String, required: true },
		// events: [String],
	},
	{ timestamps: true }
);

const CategoryModel = mongoose.model("categories", CategorySchema);
module.exports = CategoryModel;
