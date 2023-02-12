const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TicketGroupSchema = new Schema(
	{
		event: {
			type: Schema.Types.ObjectId,
			ref: "events",
			required: true,
		},
		ticketType: {
			type: String,
			required: true,
		},
		noOfPurchase: {
			type: Number,
			default: 0,
		},
		price: {
			type: Number,
			required: true,
		},
		ticketUnit: {
			type: Number,
			required: true,
		},
		ticketStartDate: {
			type: String,
			required: true,
		},
		ticketEndDate: {
			type: String,
			required: true,
		},
		owner: {
			type: Schema.Types.ObjectId,
		},
		tableTicketId: {
			type: Schema.Types.ObjectId,
			ref: "tableTicket",
		},
		sharedWith: {
			type: String,
		},
		isUsedUp: { type: Boolean, default: false },
		discountCode: {
			type: String,
		},
	},
	{ timestamps: true }
);

const TicketGroupModel = mongoose.model("ticketGroup", TicketGroupSchema);
module.exports = TicketGroupModel;
