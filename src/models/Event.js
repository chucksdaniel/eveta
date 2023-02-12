const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EventSchema = new Schema(
	{
		name: {
			type: String,
			require: true,
		},
		eventStartDate: {
			type: Date,
		},
		// eventStartTime: {
		// 	type: String,
		// 	required: true,
		// },
		// eventEndDate: {
		// 	type: Date,
		// 	required: true,
		// },
		// eventEndTime: {
		// 	type: String,
		// 	required: true,
		// },
		category: {
			type: Schema.Types.ObjectId,
			ref: "categories",
			required: true,
		},
		organizer: {
			type: String,
			required: true,
		},
		isReferralEvent: {
			type: Boolean,
			default: false,
		},
		// standPrice: {
		// 	type: Number,
		// 	required: false,
		// },

		location: [
			{
				place: {
					type: String,
					required: true,
				},
				address: {
					type: String,
				},
				eventStartDate: {
					type: Date,
					required: true,
				},
				eventStartTime: {
					type: String,
					required: true,
				},
				eventEndDate: {
					type: Date,
					required: true,
				},
				eventEndTime: {
					type: String,
					required: true,
				},
				slotPrice: {
					type: Number,
				},
			},
		],
		desc: {
			type: String,
		},
		bio: {
			type: String,
		},
		coverImage: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const EventModel = mongoose.model("events", EventSchema);
module.exports = EventModel;
