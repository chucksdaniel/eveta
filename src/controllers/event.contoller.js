const {
	createEvent,
	getEvents,
	getUpcomingEvents,
	userNextEvents,
	getEventById,
	updateEvent,
	deleteEvent,
	checkduplicateEvent,
	getEventsByCatId,
	getEventByName,
	documentCount,
} = require("../services/event.service");

const {
	getCategoryId,
	getCategoryById,
	updateNumberOfEventInACat,
} = require("../services/category.service");

const {
	getYourNextEvent,
	deleteTickets,
} = require("../services/ticket.service");

const getPagination = async (req) => {
	let { page, size } = req.query;

	page = parseInt(req.query.page);
	const limit = size ? +size : 10;
	const offset = page ? (page - 1) * limit : 0;

	return { limit, offset, page: page ? page : 1 };
};

exports.createEvent = async (req, res, next) => {
	try {
		let today = Date.now();
		const eventData = req.body;
		console.log(eventData.location[0].eventStartDate);

		if (new Date(eventData.location[0].eventStartDate) < new Date()) {
			// console.log(
			// 	"Check " + eventData.location[0].eventStartDate,
			// 	new Date()
			// );
			return res.status(400).json({
				status: "Failed",
				message: "Oops! The event start date cannot be in the past",
			});
		}
		if (
			eventData.location[0].eventEndDate <
			eventData.location[0].eventStartDate
		) {
			return res.status(400).json({
				status: "Failed",
				message:
					"Oops! The event end date cannot be in the past or before the event start date",
			});
		}
		const categoryExist = await getCategoryById(eventData.category);
		if (!categoryExist) {
			return res.status(400).json({
				status: "Failed",
				message: "Oops! Choose a valid category",
			});
		}
		eventData.name = eventData.name.trim();
		const event = await createEvent(eventData);

		const updateCategory = await updateNumberOfEventInACat(
			eventData.category
		);
		console.log(updateCategory);

		res.status(201).json({
			status: "Success",
			data: event,
			message: "Event created successfully",
		});
	} catch (error) {
		next(error);
	}
};

//
exports.getAllEvents = async (req, res, next) => {
	try {
		const { limit, offset, page } = await getPagination(req);
		const events = await getEvents(limit, offset);

		const count = await documentCount();

		res.status(200).json({
			status: "Success",
			count: count,
			totalPage: Math.ceil(count / limit),
			currentPage: page,
			data: events,
			message: "Events fetched successfully",
		});
	} catch (error) {
		next(error);
	}
};

exports.getUserNextEvents = async (req, res, next) => {
	try {
		const eventsTickets = await getYourNextEvent(req.user);

		if (!eventsTickets?.length) {
			return res.status(200).json({
				status: "Success",
				message: "OOps! You don't have any event coming up next",
			});
		}

		const eventIds = eventsTickets.map((ticket) => ticket.event);
		// console.log("Enter " + eventIds);
		const events = await userNextEvents(eventIds);

		console.log("The users event " + events);

		res.status(200).json({
			status: "Success",
			count: events.length,
			data: events,
			message: "Events fetched successfully",
		});
	} catch (error) {
		next(error);
	}
};

exports.getAllUpcomingEvents = async (req, res, next) => {
	try {
		const events = await getUpcomingEvents();

		if (!events?.length) {
			return res.status(200).json({
				status: "Success",
				message: "No upcoming event was found",
			});
		}

		res.status(200).json({
			status: "Success",
			count: events.length,
			data: events,
			message: "Events fetched successfully",
		});
	} catch (error) {
		next(error);
	}
};

exports.getAllEventsByCategoryName = async (req, res, next) => {
	try {
		const { catName } = req.params;
		// const { eventStartDate } = req.query;
		if (!catName) {
			return res.status(400).json({
				status: "Failed",
				message: "Oops! Enter the category of event",
			});
		}
		console.log(catName);
		const category = await getCategoryId(catName.trim());
		if (!category) {
			return res.status(400).json({
				status: "Failed",
				message: "Oops! Category not found",
			});
		}
		console.log(category);
		const events = await getEventsByCatId(category._id);

		res.status(200).json({
			status: "Success",
			count: events.length,
			data: events,
			message: "Events fetched successfully",
		});
	} catch (error) {
		next(error);
	}
};

exports.getAllEventsByCategoryId = async (req, res, next) => {
	try {
		const { categoryId } = req.params;
		if (!categoryId) {
			return res.status(400).json({
				status: "Failed",
				message: "Oops! Please provide the category Id of event",
			});
		}
		console.log(categoryId);
		const events = await getEventsByCatId(categoryId);

		res.status(200).json({
			status: "Success",
			count: events.length,
			data: events,
			message: "Events fetched successfully",
		});
	} catch (error) {
		next(error);
	}
};

exports.getEventByEventName = async (req, res, next) => {
	try {
		const { eventName } = req.params;
		if (!eventName) {
			return res.status(400).json({
				status: "Failed",
				message: "Oops! It's seems event name is missing",
			});
		}
		const event = await getEventByName(eventName.trim());

		res.status(200).json({
			status: "Success",
			data: event,
			message: "Events fetched successfully",
		});
	} catch (error) {
		next(error);
	}
};

exports.getEventById = async (req, res, next) => {
	try {
		const { eventId } = req.params;
		const event = await getEventById(eventId);

		if (!event) {
			return res.status(200).json({
				status: "Failed",
				message: `Oops! No event was found with the ID of ${eventId}`,
			});
		}

		res.status(200).json({
			status: "Success",
			data: event,
			message: "Event fetched successfully",
		});
	} catch (error) {
		next(error);
	}
};

exports.updateEvent = async (req, res, next) => {
	try {
		const { eventId } = req.params;
		const eventData = req.body;
		if (!eventId) {
			return res
				.status(400)
				.json({ status: "Failed", message: "Provide the ID of the event" });
		}

		if (new Date(eventData.location[0].eventStartDate) < new Date()) {
			return res.status(400).json({
				status: "Failed",
				message: "Oops! The event start date cannot be in the past",
			});
		}
		if (
			eventData.location[0].eventEndDate <
			eventData.location[0].eventStartDate
		) {
			return res.status(400).json({
				status: "Failed",
				message:
					"Oops! The event end date cannot be in the past or before the event start date",
			});
		}

		const eventExist = await getEventById(eventId);
		if (!eventExist) {
			return res.status(400).json({
				status: "Failed",
				message: `Event with the eventId ${eventId} not found`,
			});
		}

		// eventData.name = eventData.name.toLowerCase()
		eventData.name = eventData.name.trim();
		const duplicate = await checkduplicateEvent(eventData.name);
		//allow update to the original event

		if (duplicate && duplicate?._id.toString() !== eventId) {
			return res.status(409).json({
				status: "Failed",
				message: "Title already exist, Duplicate Title",
			});
		}
		eventData.eventStartDate = new Date(eventData.location[0].eventStartDate);

		const updatedEvent = await updateEvent(eventId, eventData);

		res.status(200).json({
			status: "Success",
			message: `${updatedEvent.name} updated successfully`,
		});
	} catch (error) {
		next(error);
	}
};

// Todo If you are deleting event you are deleting the whole ticket associated with it
exports.deleteEvent = async (req, res, next) => {
	try {
		const { eventId } = req.params;

		if (!eventId) {
			return res.status(400).json({
				status: "Failed",
				message: "Oops! Please provide the event ID",
			});
		}
		const event = await deleteEvent(eventId);

		if (!event) {
			return res
				.status(400)
				.json({ status: "Failed", message: "No event was found" });
		}

		// Todo
		// Check for all the tickets associated with the event and delete
		const deleteAllTicketsOfEvent = await deleteTickets(eventId);

		res.status(200).json({
			status: "Success",
			message: `${event.name} event has been deleted successfully`,
		});
	} catch (error) {
		next(error);
	}
};
