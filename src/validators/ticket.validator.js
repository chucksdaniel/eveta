const { check, validationResult } = require("express-validator");

exports.ticketValidator = [
	check("event").isString().notEmpty().withMessage("Kindly enter the event."),
	check("ticketStartDate")
		.isDate()
		.notEmpty()
		.withMessage("Event date is required."),
	check("ticketEndDate")
		.isDate()
		.notEmpty()
		.withMessage("Event date is required."),
	check("ticketType")
		.isString()
		.notEmpty()
		.withMessage("Ticket type is required."),
	// check("noOfTable")
	// 	.isString().custom(value => if(value.match(/[a-zA-Z]*(table)$/gi)))
	// 	.notEmpty()
	// 	.isIn(["standard", "vip", "table"])
	// 	.withMessage("Ticket type does contain a valid value")
	// 	.bail(),
	// check("ticketType")
	// 	.isString()
	// 	.notEmpty()
	// 	.isIn(["standard", "vip", "table"])
	// 	.withMessage("Ticket type does contain a valid value")
	// 	.bail(),
	check("price").isNumeric().withMessage("Ticket price is required."),
	check("ticketUnit")
		.isNumeric()
		.isInt({ gt: 0 })
		.withMessage("Ticket unit is required and must be an integer."),

	(req, res, next) => {
		const error = validationResult(req);
		if (!error.isEmpty())
			return res.status(400).send({
				error: error
					.array()
					.map((item) => `${item.param} Error - ${item.msg}`),
			});
		next();
	},
];

exports.ticketPurchaseValidator = [
	check("event").isString().notEmpty().withMessage("Kindly enter the event."),
	check("userId")
		.isString()
		.notEmpty()
		.withMessage("Kindly enter the userId."),
	check("noOfTicket")
		.isNumeric()
		.withMessage("Kindly enter the number of ticket you wish to buy."),
	// check("ticketType")
	// 	.isString()
	// 	.withMessage(
	// 		"Ticket type is required, Must be either student, standard, vip, vvip."
	// 	)
	// check("discountCode")
	// 	.isString()
	// 	.withMessage("Kindly enter discount code if there is any."),
	check("ticketType")
		.isString()
		.notEmpty()
		// .isIn(["standard", "vip", "table"])
		.withMessage("Ticket type does contain a valid value")
		.bail(),

	(req, res, next) => {
		const error = validationResult(req);
		if (!error.isEmpty())
			return res.status(400).send({
				error: error
					.array()
					.map((item) => `${item.param} Error - ${item.msg}`),
			});
		next();
	},
];

exports.ticketIsUsedUpValidator = [
	check("ticketId").isString().withMessage("Kindly enter the ticket ID."),

	(req, res, next) => {
		const error = validationResult(req);
		if (!error.isEmpty())
			return res.status(400).send({
				error: error
					.array()
					.map((item) => `${item.param} Error - ${item.msg}`),
			});
		next();
	},
];

exports.ticketSharingValidator = [
	check("tableTicketId")
		.isString()
		.notEmpty()
		.withMessage("Kindly enter the ticket ID."),

	check("receipientData")
		.notEmpty()
		.withMessage("Location is required")
		.isArray({ min: 1 })
		.withMessage("Location must be an array"),
	check("receipientData.*.email")
		.isEmail()
		.notEmpty()
		.withMessage("Date must be a valid value")
		.bail(),
	check("location.*.phone").isNumeric().notEmpty(),

	(req, res, next) => {
		const error = validationResult(req);
		if (!error.isEmpty())
			return res.status(400).send({
				error: error
					.array()
					.map((item) => `${item.param} Error - ${item.msg}`),
			});
		next();
	},
];
