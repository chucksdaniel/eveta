const inventoryService = require("../services/inventory.service");

const getPagination = async (req) => {
	let { page, size } = req.query;

	page = parseInt(req.query.page);
	const limit = size ? +size : 20;
	const offset = page ? (page - 1) * limit : 0;

	return { limit, offset, page: page ? page : 1 };
};

exports.getAllTickets = async (req, res, next) => {
	try {
		// const { page, size } = req.query;
		// const limit = size ? +size : 20;
		// const offset = page ? page * limit : 0;

		const { limit, offset, page } = await getPagination(req);

		const tickets = await inventoryService.getAllTickets(limit, offset);

		const count = await inventoryService.documentCountAll();

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

exports.getAllSoldTickets = async (req, res, next) => {
	try {
		const { limit, offset, page } = await getPagination(req);

		const tickets = await inventoryService.getAllSoldTickets(limit, offset);
		// if (!tickets?.length) {
		// 	return res.status(200).json({
		// 		status: "Success",
		// 		message: "Oops! There is no ticket sold yet for any event",
		// 	});
		// }

		const count = await inventoryService.countAllSoldTickets();

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

exports.getAllUnSoldTickets = async (req, res, next) => {
	try {
		const { limit, offset, page } = await getPagination(req);
		const tickets = await inventoryService.getAllUnSoldTickets(limit, offset);

		const count = await inventoryService.countAllUnsoldTickets();

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

exports.getAllTicketsOfEvent = async (req, res, next) => {
	try {
		const { eventId } = req.params;

		if (!eventId) {
			return res.status(400).json({ message: "Please provide event Id" });
		}
		const { limit, offset, page } = await getPagination(req);
		// console.log(limit);
		// console.log("Skip " + offset);
		const count = await inventoryService.documentCountForEvent(eventId);
		const tickets = await inventoryService.getAllTicketsOfAnEvent(
			eventId,
			limit,
			offset
		);

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

exports.getAllSoldTicketsOfEvent = async (req, res, next) => {
	try {
		const { eventId } = req.params;
		if (!eventId) {
			return res.status(400).json({ message: "Please provide event Id" });
		}
		const { limit, offset, page } = await getPagination(req);
		const tickets = await inventoryService.getAllSoldTicketsOfAnEvent(
			eventId,
			limit,
			offset
		);

		const count = await inventoryService.countAllSoldTicketsOfEvent(eventId);

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

exports.getAllUnSoldTicketsOfEvent = async (req, res, next) => {
	try {
		const { eventId } = req.params;
		if (!eventId) {
			return res.status(400).json({ message: "Please provide event Id" });
		}

		const { limit, offset, page } = await getPagination(req);

		const tickets = await inventoryService.getAllUnsoldTicketsOfAnEvent(
			eventId,
			limit,
			offset
		);

		// const count = await inventoryService.countAllUnsoldTicketOfEvent(eventId);

		const count = await inventoryService.getUnsoldTicketOfEvent(eventId);
		console.log(count);

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
