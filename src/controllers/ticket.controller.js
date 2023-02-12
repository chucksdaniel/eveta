const ticketService = require("../services/ticket.service");
const assignService = require("../services/assigned.service");
const eventService = require("../services/event.service");
const tableTicketService = require("../services/tableTicket.service");

const getPagination = async (req) => {
	let { page, size } = req.query;

	page = parseInt(req.query.page);
	const limit = size ? +size : 20;
	const offset = page ? (page - 1) * limit : 0;

	return { limit, offset, page: page ? page : 1 };
};

// exports.createTicket = async (req, res, next) => {
// 	try {
// 		let data = req.body;
// 		//check if eventExist
// 		data.ticketType = data.ticketType.toLowerCase();
// 		const eventExist = await eventService.getEventById(data.event);
// 		if (!eventExist) {
// 			return res.status(400).json({
// 				status: "Failed",
// 				message: "Oops! Please choose a valid event",
// 			});
// 		}
// 		console.log(`Event exist: ${eventExist}`);
// 		console.log(eventExist.location[0].eventStartDate);
// 		console.log(eventExist.location[0].eventEndDate);

// 		// Populating the ticket start date and end date from event
// 		// data.ticketEndDate = eventExist.location[0].eventEndDate;
// 		// data.ticketStartDate = eventExist.location[0].eventStartDate;

// 		let type = data.ticketType;
// 		console.log(data);
// 		// if (type.match(/[a-zA-Z]*(table)$/gi))
// 		if (type == "table") {
// 			if (!data.noOfTable) {
// 				return res.status(400).json({
// 					status: "Failed",
// 					message: "Oops! Please provide Number of table",
// 				});
// 			}
// 			for (let i = 0; i < data.ticketUnit; i++) {
// 				const tableTicket = await tableTicketService.generateTableTicket(
// 					data
// 				);
// 				// Create a field to hold the table Id in Ticket model
// 				data.tableTicketId = tableTicket._id;
// 				const tickets = await tableTicketService.generateTicket(data);
// 			}
// 			return res.status(200).json({
// 				status: "Success",
// 				conut: null,
// 				data: null,
// 				message: "Ticket generated successfully",
// 			});
// 		}

// 		const tickets = await ticketService.generateTicket(data);
// 		res.status(201).json({
// 			status: "Success",
// 			conut: tickets.length,
// 			data: tickets,
// 			message: "Ticket generated successfully",
// 		});
// 	} catch (error) {
// 		next(error);
// 	}
// };

exports.createTicket = async (req, res, next) => {
	try {
		let data = req.body;
		//check if eventExist
		data.ticketType = data.ticketType.toLowerCase();
		const eventExist = await eventService.getEventById(data.event);
		if (!eventExist) {
			return res.status(400).json({
				status: "Failed",
				message: "Oops! Please choose a valid event",
			});
		}
		console.log(`Event exist: ${eventExist}`);
		console.log(eventExist.location[0].eventStartDate);
		console.log(eventExist.location[0].eventEndDate);

		// Populating the ticket start date and end date from event
		// data.ticketEndDate = eventExist.location[0].eventEndDate;
		// data.ticketStartDate = eventExist.location[0].eventStartDate;

		let type = data.ticketType;
		console.log(data);
		// if (type.match(/[a-zA-Z]*(table)$/gi))
		if (type == "table") {
			if (!data.noOfTable) {
				return res.status(400).json({
					status: "Failed",
					message: "Oops! Please provide Number of table",
				});
			}
			for (let i = 0; i < data.ticketUnit; i++) {
				const tableTicket = await tableTicketService.generateTableTicket(
					data
				);
				// Create a field to hold the table Id in Ticket model
				data.tableTicketId = tableTicket._id;
				const tickets = await tableTicketService.generateTicket(data);
			}
			return res.status(200).json({
				status: "Success",
				conut: null,
				data: null,
				message: "Ticket generated successfully",
			});
		}
		// data.ticketStartDate = new Date(data.ticketStartDate);
		// data.ticketEndDate = new Date(data.ticketEndDate);
		const tickets = await ticketService.generateTickets(data);
		res.status(201).json({
			status: "Success",
			conut: tickets.length,
			data: tickets,
			message: "Ticket generated successfully",
		});
	} catch (error) {
		next(error);
	}
};

exports.isDiscountCodeValid = async (req, res, next) => {
	const { discountCode } = req.params;
	console.log(discountCode);
	if (!discountCode) {
		return res
			.status(400)
			.json({ message: "Please provide the discount code" });
	}
	const codeCount = await ticketService.discountCodeCount(discountCode);

	res.status(200).json({ status: "Success", codeUsage: codeCount });
};

exports.getAllTickets = async (req, res, next) => {
	try {
		const { limit, offset, page } = await getPagination(req);
		const tickets = await ticketService.getTickets(limit, offset);

		const count = await ticketService.documentCount();

		res.status(200).json({
			status: "Success",
			count: count,
			totalPage: Math.ceil(count / limit),
			currentPage: page,
			data: tickets,
			message: "Tickets fetched successfully",
		});
	} catch (error) {
		next(error);
	}
};

// To get a single ticket by ID
exports.getTicketById = async (req, res, next) => {
	try {
		const { ticketId } = req.params;
		const ticket = await ticketService.getTicketById(ticketId);
		if (!ticket) {
			return res
				.status(200)
				.json({ status: "Failed", message: "Ticket not found" });
		}
		res.status(200).json({
			status: "Success",
			data: ticket,
			message: "Tickets fetched successfully",
		});
	} catch (error) {
		next(error);
	}
};

// check
exports.getAssignedTicket = async (req, res, next) => {
	try {
		const assignedTickets = await ticketService.getAssignedTickets();
		res.status(200).json({
			status: "Success",
			count: assignedTickets.length,
			data: assignedTickets,
			message: "Ticket fetched successfully",
		});
	} catch (error) {
		next(error);
	}
};

exports.getAssignedEventTicket = async (req, res, next) => {
	try {
		const { eventId } = req.params;
		if (!eventId) {
			return res
				.status(400)
				.json({ status: "Failed", message: "Please provide eventId" });
		}
		const assignedTickets = await ticketService.getAssignedEventTickets(
			eventId
		);
		// if (!assignedTickets?.length) {
		// 	return res
		// 		.status(400)
		// 		.json({ status: "Failed", message: "No ticket found" });
		// }
		res.status(200).json({
			status: "Success",
			count: assignedTickets.length,
			data: assignedTickets,
			message: "Ticket fetched successfully",
		});
	} catch (error) {
		next(error);
	}
};

exports.getUnassignedEventTickets = async (req, res, next) => {
	try {
		const { eventId } = req.params;
		if (!eventId) {
			return res.status(400).json({ message: "Please provide event Id" });
		}
		const tickets = await ticketService.getUnassignedEventTickets(eventId);
		console.log(tickets);
		// if (!tickets?.length) {
		// 	return res.status(200).json({
		// 		status: "Failed",
		// 		message: "Oops! All tickets are sold out for the event",
		// 	});
		// }
		res.status(200).json({
			status: "Success",
			count: tickets.length,
			data: tickets,
			message: "Tickets fetched successfully",
		});
	} catch (error) {
		next(error);
	}
};

// Get tickets for an event by event ID
exports.getTicketsForEvent = async (req, res, next) => {
	try {
		const { eventId } = req.params;
		if (!eventId) {
			return res.status(400).json({
				status: "Failed",
				message: "Oops! You did not choose an event",
			});
		}

		const { limit, offset, page } = await getPagination(req);

		const tickets = await ticketService.getTicketsByEventId(
			eventId,
			limit,
			offset
		);

		const count = await ticketService.documentCountForEvent(eventId);
		res.status(200).json({
			status: "Success",
			count: count,
			totalPage: Math.ceil(count / limit),
			currentPage: page,
			data: tickets,
			message: "Tickets fetched successfully",
		});
	} catch (error) {
		next(error);
	}
};

// Get tickets for an event with event name
exports.getTicketsForEventByEventName = async (req, res, next) => {
	try {
		const { eventName } = req.params;
		const { limit, offset, page } = await getPagination(req);
		if (!eventName) {
			return res.status(400).json({
				status: "Failed",
				message: "Oops! You did not provide an event name",
			});
		}
		const eventExist = await eventService.getEventByName(eventName.trim());
		if (!eventExist) {
			return res.status(400).json({
				status: "Failed",
				message: "Oops! There is no such event",
			});
		}
		const tickets = await ticketService.getTicketsByEventId(
			eventExist._id,
			limit,
			offset
		);
		res.status(200).json({
			status: "Success",
			data: tickets,
			message: "Tickets fetched successfully",
		});
	} catch (error) {
		next(error);
	}
};

exports.purchaseTicket = async (req, res, next) => {
	try {
		let info = req.body;
		const { event, userId, noOfTicket, discountCode } = info;
		info.ticketType = req.body.ticketType.toLowerCase();

		if (info.ticketType == "table") {
			const checkTableTicketsIsAvailable =
				await tableTicketService.returnUnassignedTableTicket();
			if (!checkTableTicketsIsAvailable) {
				return res.status(400).json({
					status: "Failed",
					message: "Oops! No table ticket for the event",
				});
			}
			console.log(checkTableTicketsIsAvailable);
			const filter = { _id: checkTableTicketsIsAvailable._id };
			const update = { user: userId, event: event };
			const assignTicket = await tableTicketService.assignTableTicket(
				filter,
				update
			);

			const tableTicketId = assignTicket._id;

			const assigned = await ticketService.assignTableTicketsToUser(
				tableTicketId,
				userId
			);

			return res.status(200).json({
				status: "Success",
				data: assigned,
				message: "Ticket has been assigned to the user",
			});
		} // End of table

		// const checkTicketsIsAvailable = await ticketService.returnUnassignTickets(
		// 	event,
		// 	ticketType
		// );

		const checkTicketIsAvailable = await ticketService.returnTicketsRemaining(
			event,
			info.ticketType.toLowerCase()
		);

		if (!checkTicketIsAvailable) {
			return res
				.status(400)
				.json({ status: "Failed", message: "Oops! Ticket type not found" });
		}

		const ticketRemaining =
			parseInt(checkTicketIsAvailable.ticketUnit) -
			parseInt(checkTicketIsAvailable.noOfPurchase);

		console.log(checkTicketIsAvailable);
		console.log(ticketRemaining);

		if (ticketRemaining < noOfTicket) {
			return res
				.status(400)
				.json({ status: "Failed", message: "Oops! Ticket sold out" });
		}

		// const tickets = checkTicketsIsAvailable.slice(0, noOfTicket);
		// const ids = tickets.map((ticket) => ticket._id);
		// console.log(tickets);
		// console.log(ids);

		info.ticketGroupId = checkTicketIsAvailable._id;
		info.ticketStartDate = checkTicketIsAvailable.ticketStartDate;
		info.ticketEndDate = checkTicketIsAvailable.ticketEndDate;
		info.ticketUnit = checkTicketIsAvailable.ticketUnit;
		info.price = checkTicketIsAvailable.price;
		info.owner = info.userId;
		info.assignStatus = "assigned";
		info.discountCode = req.body.discountCode || "";

		for (let i = 0; i < noOfTicket; i++) {
			const tickets = await ticketService.generateTicket(
				info,
				checkTicketIsAvailable._id
			);

			const assignToUser = await assignService.assignTicketToUser(
				tickets._id,
				event,
				info.userId,
				info.ticketType
			);

			console.log(assignToUser);

			// const result = await ticketService.assignTickets(
			// 	ids,
			// 	userId,
			// 	discountCode
			// );
		}

		// 	const ticket = await ticketService.returnUnassignTicket(
		// 		event,
		// 		ticketType
		// 	);
		// 	console.log(ticket);

		// 	if (!ticket) {
		// 		return res
		// 			.status(400)
		// 			.json({ status: "Failed", message: "Ticket all sold out" });
		// 	}

		// 	console.log(ticket);
		// 	const { _id } = ticket;
		// 	const assignToUser = await assignService.assignTicketToUser(
		// 		_id,
		// 		event,
		// 		userId,
		// 		ticketType
		// 	);

		// 	const assigned = await ticketService.assignTicket(
		// 		_id,
		// 		userId,
		// 		discountCode
		// 	);

		res.status(200).json({
			status: "Success",
			data: null,
			message: "Ticket has been assigned to the user",
		});
	} catch (error) {
		next(error);
	}
};

exports.getMyPurchasedTickets = async (req, res, next) => {
	try {
		const myTicketsGeneral = await assignService.getUsersTickets(req.user.id);

		const myTicketsTable = await ticketService.getUsersTicketsTable(
			req.user.id
		);
		// console.log(myTicketsTable);

		res.status(200).json({
			status: "Success",
			count: {
				generalTicketCount: myTicketsGeneral.length,
				tableTicketCount: myTicketsTable.length,
				// tableTicketsCount: myTableTickets.length,
			},
			data: {
				generalTicket: myTicketsGeneral,
				tableTicket: myTicketsTable,
				// tableTickets: myTableTickets,
			},
			message: `Tickets fetched successfully`,
		});
	} catch (error) {
		next(error);
	}
};

exports.getTableTickets = async (req, res, next) => {
	try {
		const { tableTicketId } = req.params;
		const tickets = await ticketService.returnTableTickets(tableTicketId);
		console.log(tickets);

		res.status(200).json({
			status: "Success",
			count: tickets.length,
			data: tickets,
			message: "Tickets fetched successfully",
		});
	} catch (error) {
		next(error);
	}
};

exports.validateTicket = async (req, res, next) => {
	try {
		const { ticketId } = req.body;
		const checkTicketIsUsedUp = await ticketService.returnIsUsedUpTicket(
			ticketId
		);
		console.log(checkTicketIsUsedUp);
		if (!checkTicketIsUsedUp) {
			return res.status(400).json({
				status: "Failed",
				message: "Oops! Ticket already used up",
			});
		}
		const updateTicketUsedUp = await ticketService.updateTicketIsUsedUp(
			ticketId
		);
		res.status(200).json({
			status: "Success",
			data: updateTicketUsedUp,
			message: `Ticket ${updateTicketUsedUp._id} has been validated successfully`,
		});
	} catch (error) {
		next(error);
	}
};

// Endpoint for updating tickets in batch
exports.updateTicketsOfEvent = async (req, res, next) => {
	try {
		const { eventId, type } = req.params;
		const { price, ticketType } = req.body;
		const filter = {};
		const update = {};
		if (!eventId || !type) {
			return res.status(400).json({
				message: "Oops! Please select the event/ticket type to update...",
			});
		}

		filter.event = eventId;
		filter.ticketType = type;

		(update.price = price),
			(update.ticketType = ticketType ? ticketType?.toLowerCase() : type),
			console.log(filter);
		console.log(update);

		const updateTickets = await ticketService.updateEventTickets(
			eventId,
			filter,
			update
		);

		res.status(201).json({
			status: "Success",
			data: updateTickets,
			message: "Tickets has been updated successfully",
		});
	} catch (error) {
		next(error);
	}
};

exports.updateTicket = async (req, res, next) => {
	res.send("Update an ticket endpoint");
};

// This endpoint might not be needed
// exports.deleteTicket = async (req, res, next) => {
// 	try {
// 		const { ticketId } = req.params;
// 		const ticket = await ticketService.deleteTicket(ticketId);
// 		if (!ticket) {
// 			return res.status(400).json({ message: "Ticket does not exist..." });
// 		}
// 		res.status(200).json({
// 			status: "Success",
// 			data: ticket,
// 			message: `Ticket ${ticket._id} has been deleted successfully`,
// 		});
// 	} catch (error) {
// 		next(error);
// 	}
// };

// For deleting all ticket associated to an event
exports.deleteAllTicketsForAnEvent = async (req, res, next) => {
	try {
		const { eventId } = req.params;
		const ticket = await ticketService.deleteTickets(eventId);
		if (!ticket) {
			return res.status(400).json({ message: "Ticket does not exist..." });
		}
		res.status(200).json({
			status: "Success",
			data: ticket,
			message: `Tickets has been deleted successfully`,
		});
	} catch (error) {
		next(error);
	}
};

// Endpoint for updating tickets in batch
exports.deleteTicketsInBatchOfEvent = async (req, res, next) => {
	try {
		const { eventId, type } = req.params;
		const filter = {};
		if (!eventId || !type) {
			return res.status(400).json({
				message: "Oops! Please select the event/ticket type to delete...",
			});
		}

		filter.event = eventId;
		filter.ticketType = type.toLowerCase();

		const deleteTickets = await ticketService.deleteEventTicketsInBatch(
			eventId,
			type,
			filter
		);

		res.status(201).json({
			status: "Success",
			data: null,
			message: `Tickets of type ${type} has been deleted successfully`,
		});
	} catch (error) {
		next(error);
	}
};

// For filter
exports.getAllTicketsForAnEvent = async (req, res, next) => {
	try {
		const { eventId } = req.params;
		let { ticketType, assignStatus, price } = req.query;

		if (!eventId) {
			return res.status(400).json({
				status: "Failed",
				message: "Oops! You did not choose an event",
			});
		}
		const filter = {};
		filter.event = eventId;
		ticketType = ticketType ? ticketType?.toLowerCase() : "";
		assignStatus = ticketType ? assignStatus?.toLowerCase() : "";
		console.log(ticketType, assignStatus, price);

		if (ticketType && ticketType != "") filter.ticketType = ticketType;
		if (price && !isNaN(price)) filter.price = price;
		if (assignStatus && assignStatus != "")
			filter.assignStatus = assignStatus;

		const { limit, offset, page } = await getPagination(req);
		console.log(filter);

		const tickets = await ticketService.getTicketsForEventId(
			eventId,
			filter,
			limit,
			offset
		);

		const count = await ticketService.documentCountTicketsForEvent(filter);
		res.status(200).json({
			status: "Success",
			count: count,
			totalPage: Math.ceil(count / limit),
			currentPage: page,
			data: tickets,
			message: "Tickets fetched successfully",
		});
	} catch (error) {
		next(error);
	}
};
