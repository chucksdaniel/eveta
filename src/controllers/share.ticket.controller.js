const shareTicketService = require("../services/share.ticket.service");

exports.shareTableTicket = async (req, res, next) => {
	try {
		const data = req.body;
		const checkTableTicket = await shareTicketService.checkTableTickets(
			data.tableTicketId,
			req.user.id
		);
		if (!checkTableTicket?.length) {
			return res
				.status(200)
				.json({ status: "Failed", message: "Oop! No table ticket found" });
		}
		if (checkTableTicket.length < data.receipientData.length) {
			return res.status(400).json({
				status: "Failed",
				message: "Oop! You don't have enough table ticket to share",
			});
		}
		console.log(checkTableTicket);
		console.log(data.receipientData.length);
		console.log(checkTableTicket.length);
		for (let i = 0; i < data.receipientData.length; i++) {
			const shareTicket = await shareTicketService.shareTableTicketToUser(
				data.receipientData[i].email,
				checkTableTicket[i],
				req.user
			);
		}
		res.status(200).json({
			status: "Success",
			data: null,
			message: "Ticket shared successfully",
		});
	} catch (error) {
		next(error);
	}
};

// To share other tickets
exports.shareOtherTickets = async (req, res, next) => {
	try {
		const data = req.body;
		const checkTicket = await shareTicketService.checkTicket(req.user.id);
		if (!checkTicket?.length) {
			return res
				.status(200)
				.json({ status: "Failed", message: "Oop! No ticket found" });
		}
		if (checkTicket.length <= 1) {
			return res.status(200).json({
				status: "Failed",
				message: "Oop! You don't have enough ticket to share",
			});
		}
		console.log(checkTicket);
		console.log(data.receipientData.length);
		console.log(checkTicket.length);
		for (let i = 0; i < data.receipientData.length; i++) {
			const shareTicket = await shareTicketService.shareTicketToUser(
				data.receipientData[i].email,
				checkTicket[i],
				req.user
			);
		}
		res.status(200).json({
			status: "Success",
			data: null,
			message: "Ticket shared successfully",
		});
	} catch (error) {
		next(error);
	}
};
// End of shareOtherTickets

exports.getMySharedTicket = async (req, res, next) => {
	try {
		const getMySharedTicket = await shareTicketService.getMySharedTicket(
			req.user.email
		);
		res.status(200).json({
			status: "Success",
			data: getMySharedTicket,
			message: "Shared ticket fetched successfully",
		});
	} catch (error) {
		next(error);
	}
};

exports.getAllSharedTableTicket = async (req, res, next) => {
	try {
		const sharedTickets = await shareTicketService.getTableTickets();
		if (!sharedTickets) {
			return res.status(400).json({
				status: "Failed",
				message: "Oop! No table ticket was shared",
			});
		}
		res.status(200).json({
			status: "Success",
			count: sharedTickets.length,
			data: sharedTickets,
			message: "Shared tickets fetched successfully",
		});
	} catch (error) {
		next(error);
	}
};

exports.redeemSharedTableTicket = async (req, res, next) => {
	try {
		const { ticketId } = req.params;
		const redeemTicket = await shareTicketService.redeemMySharedTicket(
			ticketId,
			req.user
		);
		if (!redeemTicket) {
			return res.status(400).json({
				status: "Failed",
				message: "Oop! Something went wrong",
			});
		}
		console.log(redeemTicket);
		res.send("Redeem share table ticket endpoint");
	} catch (error) {
		next(error);
	}
};

exports.shareTicket = async (req, res, next) => {};
