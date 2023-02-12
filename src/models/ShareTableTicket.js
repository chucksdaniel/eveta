const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ShareTableTicketSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
		},

		ticketId: {
			type: Schema.Types.ObjectId,
			ref: "tickets",
			required: true,
		},
		ownerId: {
			type: Schema.Types.ObjectId,
		},
		isRedeemed: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const ShareTableTicketModel = mongoose.model(
	"shareTableTicket",
	ShareTableTicketSchema
);
module.exports = ShareTableTicketModel;
