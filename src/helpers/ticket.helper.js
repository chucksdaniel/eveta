exports.purchaseTableTicket = async (ticketType) => {
	if (ticketType == "table") {
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
		const update = { user: userId };
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
	}
};
