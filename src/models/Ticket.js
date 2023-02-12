const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TicketSchema = new Schema(
	{
		event: {
			type: Schema.Types.ObjectId,
			ref: "events",
			required: true,
		},
		ticketType: {
			type: String,
			// enum: ["standard", "vip", "table"],
			required: true,
		},
		assignStatus: {
			type: String,
			enum: ["assigned", "not_assigned", "invalid"],
			default: "not_assigned",
		},
		price: {
			type: Number,
			required: true,
		},
		ticketUnit: {
			type: Number,
			required: true,
		},
		// noOfTable: {
		// 	type: Number,
		// 	required: function () {
		// 		if (this.ticketType === "vip" || this.ticketType === "vvip")
		// 			return true;
		// 	},
		// },
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
		ticketGroupId: {
			type: Schema.Types.ObjectId,
			ref: "ticketGroup",
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

const TicketModel = mongoose.model("tickets", TicketSchema);
module.exports = TicketModel;
