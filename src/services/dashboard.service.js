const Category = require("../models/Category");
const Event = require("../models/Event");
const Ticket = require("../models/Ticket");
const TicketGroup = require("../models/TicketGroup");

exports.getTotalCategory = async () => {
	const categoryCount = await Category.countDocuments();
	return categoryCount;
};

exports.getTotalEvent = async () => {
	const eventCount = await Event.countDocuments();
	return eventCount;
};

// exports.getTotalTicket = async () => {
// 	const ticketCount = await Ticket.countDocuments();
// 	return ticketCount;
// };

exports.getTotalTicket = async () => {
	const count = await TicketGroup.find({});

	let total = 0;
	for (let i = 0; i < count.length; i++) {
		total += parseInt(count[i].ticketUnit);
	}
	return total;
};

// exports.getTotalSoldTicket = async () => {
// 	const soldTicketCount = await Ticket.countDocuments({
// 		assignStatus: "assigned",
// 	});
// 	return soldTicketCount;
// };

exports.getTotalSoldTicket = async () => {
	const count = await TicketGroup.find({});
	let sold = 0;

	for (let i = 0; i < count.length; i++) {
		sold += parseInt(count[i].noOfPurchase);
	}

	console.log("sold " + sold);

	return sold;
};
