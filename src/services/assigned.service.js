const AssignedToModel = require("../models/AssignTicketToUsers");

exports.assignTicketsToUser = async (ticketsId, event, user, type) => {
	try {
		// console.log("Ticket " + ticketId);
		const assigned = await AssignedToModel.insertMany(
			ticketsId.map((ticketId) => ({
				ticket: ticketId,
				event: event,
				user: user,
				type,
			}))
		);

		return assigned;
	} catch (error) {
		throw error;
	}
};

exports.assignTicketToUser = async (ticketId, event, user, type) => {
	try {
		// console.log("Ticket " + ticketId);
		const assigned = await AssignedToModel.create({
			ticket: ticketId,
			event: event,
			user: user,
			type,
		});

		return assigned;
	} catch (error) {
		throw error;
	}
};

exports.assignTicketToUser = async (ticketId, event, user, type) => {
	try {
		// console.log("Ticket " + ticketId);
		const assigned = new AssignedToModel({
			ticket: ticketId,
			event: event,
			user: user,
			ticketType: type,
		});

		await assigned.save();

		return assigned;
	} catch (error) {
		throw error;
	}
};

exports.getUsersTickets = async (userId) => {
	const tickets = await AssignedToModel.find({ user: userId })
		.populate({ path: "ticket", populate: { path: "event" } })
		.lean();
	return tickets;
};

exports.getAllUsersTickets = async (userId) => {
	const tickets = await AssignedToModel.find({}).lean();
	return tickets;
};
