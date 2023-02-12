const Ticket = require("../models/Ticket");
const TicketGroup = require("../models/TicketGroup");

exports.getAllTickets = async (limit, offset) => {
	const tickets = await Ticket.find({})
		.limit(limit)
		.skip(offset)
		.populate("event", "_id name category");
	return tickets;
};

exports.documentCountAll = async () => {
	const count = await Ticket.countDocuments();
	return count;
};

exports.getAllSoldTickets = async (limit, offset) => {
	const tickets = await Ticket.find({ assignStatus: "assigned" })
		.limit(limit)
		.skip(offset)
		.populate("event", "_id name category");
	return tickets;
};

exports.countAllSoldTickets = async () => {
	const count = Ticket.countDocuments({
		assignStatus: "assigned",
	});

	return count;
};

// exports.getAllUnSoldTickets = async (limit, offset) => {
// 	const tickets = await Ticket.find({ assignStatus: "not_assigned" })
// 		.limit(limit)
// 		.skip(offset)
// 		.populate("event", "_id name category");
// 	return tickets;
// };

exports.getAllUnSoldTickets = async (limit, offset) => {
	const tickets = await Ticket.find({ assignStatus: "not_assigned" })
		.limit(limit)
		.skip(offset)
		.populate("event", "_id name category");
	return tickets;
};

// exports.countAllUnsoldTickets = async () => {
// 	const count = Ticket.countDocuments({
// 		assignStatus: "not_assigned",
// 	});

// 	return count;
// };

exports.countAllUnsoldTickets = async () => {
	const count = await TicketGroup.find({});

	let total = 0;
	let sold = 0;

	for (let i = 0; i < count.length; i++) {
		total += count[i].ticketUnit;
		sold += count[i].noOfPurchase;
	}

	const unsold = total - sold;

	console.log("Unsold" + unsold);

	return unsold;
};

exports.getAllTicketsOfAnEvent = async (eventId, limit, offset) => {
	const tickets = await Ticket.find({ event: eventId })
		.populate("event")
		.limit(limit)
		.skip(offset)
		.lean();
	return tickets;
};

exports.documentCountForEvent = async (eventId) => {
	const count = await Ticket.countDocuments({ event: eventId });
	return count;
};

exports.getAllSoldTicketsOfAnEvent = async (eventId) => {
	const tickets = await Ticket.find({
		event: eventId,
		assignStatus: "assigned",
	})
		.populate("event", "_id name category")
		.lean();
	return tickets;
};

exports.countAllSoldTicketsOfEvent = async (eventId) => {
	// const count = await Ticket.countDocuments({
	// 	event: eventId,
	// 	assignStatus: "assigned",
	// });
	// return count;

	const count = await TicketGroup.find({ event: eventId });
	let total = 0;
	let sold = 0;

	for (let i = 0; i < count.length; i++) {
		total += parseInt(count[i].ticketUnit);
		sold += parseInt(count[i].noOfPurchase);
	}

	const unsold = total - sold;

	console.log("sold " + sold);
	console.log(count);

	return sold;
};

exports.getAllUnsoldTicketsOfAnEvent = async (eventId, limit, offset) => {
	const tickets = await Ticket.find({
		event: eventId,
		assignStatus: "not_assigned",
	})
		.limit(limit)
		.skip(offset)
		.populate("event")
		.lean();
	return tickets;
};

exports.countAllUnsoldTicketOfEvent = async (eventId) => {
	const count = await Ticket.countDocuments({
		event: eventId,
		assignStatus: "not_assigned",
	});

	return count;
};

exports.getUnsoldTicketOfEvent = async (eventId) => {
	// const tickets = await TicketGroup.findOne({
	// 	event: eventId,
	// });

	// console.log(tickets);

	const count = await TicketGroup.find({ event: eventId });

	let total = 0;
	let sold = 0;

	for (let i = 0; i < count.length; i++) {
		total += count[i].ticketUnit;
		sold += count[i].noOfPurchase;
	}

	const unsold = total - sold;

	console.log(unsold);

	return unsold;

	// return parseInt(tickets.ticketUnit) - parseInt(tickets.noOfPurchase);
};
