const TableTicketModel = require("../models/TableTicket");
const Ticket = require("../models/Ticket");
const ApiError = require("../utils/errorHandler");
const mongoose = require("mongoose");
const Event = require("../models/Event");
const TicketGroupModel = require("../models/TicketGroup");
const { response } = require("express");

let now = Date.now();
let today = new Date(now);

exports.getTickets = async (limit, offset) => {
	const tickets = await Ticket.find()
		.populate("event", "_id name location")
		.limit(limit)
		.skip(offset)
		.lean();

	return tickets;
};

exports.discountCodeCount = async (discountCode) => {
	const count = await Ticket.countDocuments({ discountCode: discountCode });
	return count;
};

exports.documentCountForEvent = async (eventId) => {
	const count = await Ticket.countDocuments({ event: eventId });
	return count;
};

exports.documentCount = async () => {
	const count = await Ticket.countDocuments({});
	return count;
};

// exports.generateTickets = async (data) => {
// 	try {
// 		const length = data.ticketUnit;
// 		const tickets = await Ticket.insertMany(
// 			[...Array(length)].map(() => data)
// 		);

// 		return tickets;
// 	} catch (error) {
// 		throw error;
// 	}
// };

//Creates a sample ticket for the event that tracks the number of tickets generated
exports.generateTickets = async (data) => {
	try {
		const ticket = await TicketGroupModel.create(data);

		return ticket;
	} catch (error) {
		throw error;
	}
};

//Create ticket records at purchase time for user and update the ticket inventory
exports.generateTicket = async (data, id) => {
	try {
		// const length = data.ticketUnit;
		const tickets = await Ticket.create(data);

		const update = await TicketGroupModel.findOneAndUpdate(
			{ _id: id },
			{ $inc: { noOfPurchase: 1 } }
		);
		return tickets;
	} catch (error) {
		throw error;
	}
};

// (length) => {
//    Array.from({ length }, () => ({ ...data }));
// }

exports.getTicketById = async (ticketId) => {
	try {
		const ticket = await Ticket.findById(ticketId);
		return ticket;
	} catch (error) {
		throw error;
	}
};

exports.getYourNextEvent = async (user) => {
	const event = await Ticket.find({
		owner: user.id,
		// ticketStartDate: { $gt: today.toDateString() },
		ticketStartDate: { $gt: today.getDate() },
	});
	// console.log("Your next event");
	// console.log(event[0]);
	return event;
};

exports.getTicketsByEventId = async (eventId, limit, offset) => {
	const tickets = await Ticket.find({ event: eventId })
		.populate("event")
		.limit(limit)
		.skip(offset)
		.lean();
	return tickets;
};

exports.getAssignedTickets = async () => {
	const tickets = await Ticket.find({
		assignStatus: "assigned",
	}).lean();
	return tickets;
};

exports.getAssignedEventTickets = async (eventId) => {
	const tickets = await Ticket.find({
		event: eventId,
		assignStatus: "assigned",
	})
		.populate("event")
		.lean();
	return tickets;
};

exports.getUnassignedTickets = async () => {
	const tickets = await Ticket.find({ assignStatus: "not_assigned" }).lean();
	return tickets;
};

// Ticket showcase service
exports.getUnassignedEventTickets = async (eventId) => {
	const response = await TicketGroupModel.find({ event: eventId });

	// console.log(eventId);
	// let idToSearch = mongoose.Types.ObjectId(eventId);
	// const response = await Ticket.aggregate([
	// 	{ $match: { event: idToSearch, assignStatus: "not_assigned" } },
	// 	{
	// 		$group: {
	// 			_id: { ticketType: "$ticketType" },
	// 			ticketDetails: {
	// 				$push: {
	// 					_id: "$_id",
	// 					ticketType: "$ticketType",
	// 					event: "$event",
	// 					price: "$price",
	// 					ticketUnit: "$ticketUnit",
	// 					ticketStartDate: "$ticketStartDate",
	// 					ticketEndDate: "$ticketEndDate",
	// 					isUsedUp: "$isUsedUp",
	// 					owner: "$owner",
	// 				},
	// 			},
	// 		},
	// 	},
	// ]).sort({ ticketType: 1 });

	let ans = [];

	console.log("Obj" + response.length);

	let eventDetails = await Event.findOne({ _id: eventId });

	for (let i = 0; i < response.length; i++) {
		// let ticketDetail = await Ticket.findOne({
		// 	event: response[i].event,
		// 	ticketType: response[i].ticketType,
		// }).populate("event");

		// let eventDetails = await Event.findOne({
		// 	_id: response[i].ticketDetails[0].event,
		// });

		let obj = {
			ticketType: response[i].ticketType,
			available:
				parseInt(response[i].ticketUnit) -
				parseInt(response[i].noOfPurchase),
			totalCount: response[i].ticketUnit,
			ticketDetail: {
				price: response[i].price,
				event: eventDetails,
			},
		};
		// obj.ticketDetail.event = eventDetails;
		ans.push(obj);
	}

	// const standardTickets = await Ticket.countDocuments({
	// 	event: eventId,
	// 	assignStatus: "not_assigned",
	// 	ticketType: "standard",
	// });
	// const vipTickets = await Ticket.countDocuments({
	// 	event: eventId,
	// 	assignStatus: "not_assigned",
	// 	ticketType: "vip",
	// });

	// const totalCountStardard = await Ticket.countDocuments({
	// 	event: eventId,
	// 	ticketType: "standard",
	// });

	// const totalCountVip = await Ticket.countDocuments({
	// 	event: eventId,
	// 	ticketType: "vip",
	// });

	// const ticketDetailStandard = await Ticket.findOne({
	// 	event: eventId,
	// 	ticketType: "standard",
	// }).populate("event");

	// const ticketDetailVip = await Ticket.findOne({
	// 	event: eventId,
	// 	ticketType: "vip",
	// }).populate("event");

	// let response = [
	// 	{
	// 		ticketType: "standard",
	// 		available: standardTickets,
	// 		totalCount: totalCountStardard,
	// 		ticketDetail: ticketDetailStandard,
	// 	},
	// 	{
	// 		ticketType: "vip",
	// 		available: vipTickets,
	// 		totalCount: totalCountVip,
	// 		ticketDetail: ticketDetailVip,
	// 	},
	// ];

	return ans;
};

exports.returnUnassignTicket = async (eventId, type) => {
	const ticket = await Ticket.findOne({
		event: eventId,
		ticketType: type,
		assignStatus: "not_assigned",
	});
	return ticket;
};

exports.returnTicketsRemaining = async (eventId, type) => {
	const tickets = await TicketGroupModel.findOne({
		event: eventId,
		ticketType: type,
	});

	return tickets;
};

exports.returnUnassignTickets = async (eventId, type) => {
	const ticket = await Ticket.find({
		event: eventId,
		ticketType: type,
		assignStatus: "not_assigned",
	});
	return ticket;
};

// Assigning only one ticket to a user
exports.assignTicket = async (ticketId, user, discountCode) => {
	const ticket = await Ticket.findByIdAndUpdate(
		ticketId,
		{ assignStatus: "assigned", owner: user, discountCode: discountCode },
		{ new: true }
	);

	return ticket;
};

// Assigning more than one ticket to a user
exports.assignTickets = async (ticketIds, user, discountCode) => {
	const tickets = await Ticket.updateMany(
		{ _id: { $in: ticketIds } },
		{
			$set: {
				assignStatus: "assigned",
				owner: user,
				discountCode: discountCode,
			},
		}
	);

	return tickets;
};

exports.assignTableTicketsToUser = async (ticketId, user) => {
	const tickets = await Ticket.updateMany(
		{ tableTicketId: ticketId },
		{ $set: { owner: user } }
	);

	return tickets;
};

exports.getInvalidTicket = async () => {
	const tickets = await Ticket.find({ assignStatus: "invalid" }).lean();
	return tickets;
};

exports.returnIsUsedUpTicket = async (ticketId) => {
	const ticket = await Ticket.findOne({
		_id: ticketId,
		isUsedUp: false,
		ticketEndDate: { $gte: Date.now() },
	}).lean();
	return ticket;
	// ticketEndDate: { $eq: today.toDateString() },
};

exports.updateTicketIsUsedUp = async (ticketId) => {
	const filter = { _id: ticketId };
	const update = { isUsedUp: true };
	const ticket = Ticket.findOneAndUpdate(filter, update, { new: true });

	return ticket;
};

exports.getUsersTicketsTable = async (userId) => {
	console.log(userId);
	const tickets = await TableTicketModel.find({ user: userId });
	return tickets;
};

exports.returnTableTickets = async (tableId) => {
	const tickets = await Ticket.find({ tableTicketId: tableId })
		.populate("event")
		.lean();
	return tickets;
};

// exports.getUsersTicketsTable = async (userId) => {
// 	const tickets = await Ticket.aggregate([
// 		{ $match: { owner: userId } },
// 		{
// 			$group: {
// 				_id: "$tableTicketId",
// 				ticketDetails: {
// 					$push: {
// 						_id: "$_id",
// 						ticketType: "$ticketType",
// 						owner: "$owner",
// 					},
// 				},
// 			},
// 		},
// 	]);
// 	return tickets;
// };

exports.updateEventTickets = async (eventId, filter, update) => {
	const tickets = await Ticket.updateMany(filter, { $set: update });

	return tickets;
};

// For testing
exports.getTicketsForEventId = async (eventId, filter, limit, offset) => {
	const tickets = await Ticket.find(filter)
		.populate("event")
		.limit(limit)
		.skip(offset)
		.lean();
	return tickets;
};

exports.documentCountTicketsForEvent = async (filter) => {
	const count = await Ticket.countDocuments(filter);
	return count;
};

// For the development and testing
exports.deleteTickets = async (eventId) => {
	const ticketGroup = await TicketGroupModel.findOneAndDelete({
		event: eventId,
	});
	const tickets = Ticket.deleteMany({ event: eventId });

	return { ticketGroup, tickets };
};

// Delete a particular ticket type in batch
exports.deleteEventTicketsInBatch = async (eventId, type, filter) => {
	const ticketGroup = await TicketGroupModel.findOneAndDelete(filter);

	const tickets = await Ticket.deleteMany(filter);

	console.log("Ticket delete " + ticketGroup, tickets.count);

	return ticketGroup;
};
