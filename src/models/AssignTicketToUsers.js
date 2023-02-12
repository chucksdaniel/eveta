const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AssignedToSchema = new Schema(
	{
		event: {
			type: Schema.Types.ObjectId,
			ref: "events",
		},
		ticket: {
			type: Schema.Types.ObjectId,
			ref: "tickets",
			required: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			required: true,
		},
		ticketType: {
			type: String,
		},
	},
	{ timestamps: true }
);

const AssignedToModel = mongoose.model("assignedTo", AssignedToSchema);
module.exports = AssignedToModel;
