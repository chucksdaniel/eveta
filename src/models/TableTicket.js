const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TableTicketSchema = new Schema(
	{
		event: {
			type: Schema.Types.ObjectId,
			ref: "events",
			required: true,
		},
		user: {
			type: Schema.Types.ObjectId,
		},
		noOfTable: {
			type: Number,
			require: true,
		},
	},
	{ timestamps: true }
);

const TableTicketModel = mongoose.model("tableTicket", TableTicketSchema);
module.exports = TableTicketModel;
