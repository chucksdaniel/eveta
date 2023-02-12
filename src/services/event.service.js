const Event = require("../models/Event");
const ApiError = require("../utils/errorHandler");

let now = Date.now();
let today = new Date(now);

exports.documentCount = async () => {
	const count = await Event.countDocuments({});
	return count;
};

exports.getUpcomingEvents = async () => {
	const events = await Event.find({
		// eventStartDate: { $gte: today.toDateString() },
		eventStartDate: { $gte: Date.now() },
	})
		.populate("category")
		.sort({ eventStartDate: 1 })
		.lean();

	return events;
};

exports.userNextEvents = async (eventIds) => {
	const events = Event.find({ _id: { $in: eventIds } });

	return events;
};

exports.getEvents = async (limit, offset) => {
	const events = await Event.find()
		.limit(limit)
		.skip(offset)
		.populate("category")
		.sort({ createdAt: -1 })
		.lean();
	return events;
};

exports.createEvent = async (data) => {
	try {
		const name = data.name;
		const eventExist = await Event.findOne({ name });
		if (eventExist) {
			throw new ApiError(
				400,
				"An event with that with the name already exists"
			);
		}

		// .toISOString() .toDateString() .toString()
		const event = new Event({
			name: data.name,
			category: data.category,
			desc: data.desc,
			bio: data.bio,
			eventStartDate: new Date(data.location[0].eventStartDate),
			organizer: data.organizer,
			coverImage: data.coverImage,
			isReferralEvent: data.isReferralEvent,

			location: [
				{
					place: data.location[0].place,
					address: data.location[0].address,
					eventStartDate: new Date(data.location[0].eventStartDate),
					eventEndDate: new Date(data.location[0].eventEndDate),
					eventStartTime: data.location[0].eventStartTime,
					eventEndTime: data.location[0].eventEndTime,
					slotPrice: data.location[0].slotPrice,
				},
			],
		});
		await event.save();

		return event;
	} catch (error) {
		throw error;
	}
};

exports.getEventById = async (eventId) => {
	try {
		const event = await Event.findById(eventId).populate("category");
		return event;
	} catch (error) {
		throw error;
	}
};

exports.updateEvent = async (eventId, data) => {
	try {
		const updatedEvent = await Event.findByIdAndUpdate(eventId, data, {
			new: true,
		});
		// await eventExist.save();
		return updatedEvent;
	} catch (error) {
		throw error;
	}
};

exports.deleteEvent = async (eventId) => {
	try {
		return await Event.findByIdAndDelete(eventId);
	} catch (error) {
		throw error;
	}
};

exports.checkduplicateEvent = async (name) => {
	try {
		const duplicate = await Event.findOne({ name }).lean().exec();
		console.log(duplicate);
		return duplicate;
	} catch (error) {
		throw error;
	}
};

exports.getEventCategory = async (eventId) => {
	try {
		const eventCategory = await Event.findById(eventId).lean();
		console.log(eventCategory);
		return eventCategory.category;
	} catch (error) {
		throw error;
	}
};

exports.getEventsByCatId = async (catId) => {
	try {
		const event = await Event.find({
			category: catId,
			"location.eventEndDate": { $gte: new Date() },
			// "location.eventEndDate": { $gte: today.toDateString() },
		}).lean();
		console.log(event);
		return event;
	} catch (error) {
		throw error;
	}
};

exports.getEventByName = async (eventName) => {
	const event = await Event.findOne({ name: eventName })
		.populate("category")
		.lean();
	return event;
};
