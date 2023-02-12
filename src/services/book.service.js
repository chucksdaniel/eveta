const BookEventModel = require("../models/BookEvent");

exports.bookEvent = async (eventId, userId) => {
	const booked = new BookEventModel({ event: eventId, user: userId });
	await booked.save();

	// const book = await BookEventModel.create({event: eventId, user: userId})
	return booked;
};

exports.getEventsBookedByUser = async (userId) => {
	try {
		const bookedEvents = await BookEventModel.find({ user: userId })
			.populate("event")
			.lean();
		return bookedEvents;
	} catch (error) {
		throw error;
	}
};

exports.getAllBookedEvents = async () => {
	try {
		const bookedEvents = await BookEventModel.find().populate("event").lean();
		return bookedEvents;
	} catch (error) {
		throw error;
	}
};
