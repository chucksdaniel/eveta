const TableTicketModel = require("../models/TableTicket");
const Ticket = require("../models/Ticket");

exports.generateTableTicket = async (data) => {
	const tickets = new TableTicketModel(data);
	await tickets.save();

	return tickets;
};

exports.generateTicket = async (data) => {
	try {
		const length = data.noOfTable;
		const tickets = await Ticket.insertMany(
			[...Array(length)].map(() => data)
		);

		return tickets;
	} catch (error) {
		throw error;
	}
};

exports.returnUnassignedTableTicket = async () => {
	const tickets = TableTicketModel.findOne({ user: null });

	return tickets;
};

exports.returnUnassignedTableTickets = async () => {
	const tickets = TableTicketModel.find({ user: null });

	return tickets;
};

exports.assignTableTicket = async (filter, update) => {
	const ticket = TableTicketModel.findOneAndUpdate(filter, update);

	return ticket;
};
