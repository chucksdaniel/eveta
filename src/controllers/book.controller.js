const {
	bookEvent,
	getAllBookedEvents,
	getEventsBookedByUser,
} = require("../services/book.service");
const { getEventById } = require("../services/event.service");

exports.getAllBookedEvents = async (req, res, next) => {
	try {
		const bookedEvents = await getAllBookedEvents();
		if (!bookedEvents) {
			return res.status(400).json({
				status: "Failed",
				message: "Oops! It seems there is no event you booked yet",
			});
		}
		res.status(200).json({
			status: "Success",
			count: bookEvent.length,
			data: bookedEvents,
			message: "Booked events was fetched successful",
		});
	} catch (error) {
		next(error);
	}
};

exports.getBookedEvents = async (req, res, next) => {
	try {
		const bookedEvents = await getEventsBookedByUser(req.user.id);
		if (!bookedEvents) {
			return res.status(400).json({
				status: "Failed",
				message: "Oops! It seems there is no event you booked yet",
			});
		}
		res.status(200).json({
			status: "Success",
			count: bookEvent.length,
			data: bookedEvents,
			message: "Booked events was fetched successful",
		});
	} catch (error) {
		next(error);
	}
};

exports.bookEvent = async (req, res, next) => {
	try {
		const { eventId, userId } = req.body;
		const eventExist = await getEventById(eventId);
		// console.log(`The userId ${req.user.id}`);
		if (!eventExist) {
			return res.status(400).json({
				status: "Failed",
				message: "Oops! It seems there is no such event",
			});
		}
		const booked = await bookEvent(eventId, userId);
		if (!booked) {
			return res.status(400).json({
				status: "Failed",
				message: "Oops! Something went wrong",
			});
		}
		res.status(200).json({
			status: "Success",
			data: booked,
			message: "Event book was successful",
		});
	} catch (error) {
		next(error);
	}
};
