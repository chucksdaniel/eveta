const dashboardService = require("../services/dashboard.service");

exports.getDashboardStat = async (req, res, next) => {
	try {
		const totalCategory = await dashboardService.getTotalCategory();
		const totalEvent = await dashboardService.getTotalEvent();
		const totalTicket = await dashboardService.getTotalTicket();
		const totalSoldTicket = await dashboardService.getTotalSoldTicket();

		res.status(200).json({
			status: "Success",
			data: {
				total_category: totalCategory,
				total_event: totalEvent,
				total_ticket: totalTicket,
				total_sold_ticket: totalSoldTicket,
			},
			message: "Satistics fetched successfully",
		});
	} catch (error) {
		next(error);
	}
};
