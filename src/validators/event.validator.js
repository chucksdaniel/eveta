const { check, validationResult } = require("express-validator");

exports.bookEventValidator = [
	check("eventId")
		.isString()
		.notEmpty()
		.withMessage("Kindly enter the event."),
	check("userId")
		.isString()
		.notEmpty()
		.withMessage("Kindly enter the userId."),

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

exports.createEventValidator = [
	check("name")
		.isString()
		.notEmpty()
		.withMessage("Kindly enter the event name."),
	check("category")
		.isString()
		.notEmpty()
		.withMessage("Event category of the event is required."),
	check("organizer")
		.isString()
		.notEmpty()
		.withMessage("Organizer is required"),
	// check("eventStartDate")
	// 	.isDate()
	// 	.notEmpty()
	// 	.withMessage("Event date is required."),

	check("bio").isString().withMessage("Bio is required."),
	check("desc").isString().notEmpty().withMessage("Description is required."),
	// check("location")
	// 	.isString()
	// 	.notEmpty()
	// 	.withMessage("Location of the event required."),
	check("coverImage")
		.isString()
		.notEmpty()
		.withMessage("Image upload for the event."),

	check("location")
		.notEmpty()
		.withMessage("Location is required")
		.isArray()
		.withMessage("Location must be an array"),
	check("location.*.place")
		.isString()
		.notEmpty()
		.withMessage("Place of the event is required"),
	check("location.*.eventStartDate")
		.isDate()
		.notEmpty()
		.withMessage("Date must be a valid value")
		.bail(),
	check("location.*.eventEndDate")
		.isDate()
		.notEmpty()
		.withMessage("Date must be a valid value")
		.bail(),
	check("location.*.eventStartTime")
		.isString()
		.notEmpty()
		.matches(/^([0-9]{2})\:([0-9]{2})$/)
		.withMessage("Please enter start time for the event"),
	check("location.*.eventEndTime")
		.isString()
		.notEmpty()
		.matches(/^([0-9]{2})\:([0-9]{2})$/)
		.withMessage("Please enter end time for the event"),
	check("location.*.slotPrice")
		.isNumeric()
		.withMessage("Please enter the price for the event"),
	// check("name").isString().custom(value => value.replace(/^\s+|\s+$/g).withMessage("Kindly enter the event name."),

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

// exports.createEventValidator2 = [
// 	check("name")
// 		.isString()
// 		.notEmpty()
// 		.withMessage("Kindly enter the event name."),
// 	check("category")
// 		.isString()
// 		.notEmpty()
// 		.withMessage("Event category is required."),
// 	check("organizer")
// 		.isString()
// 		.notEmpty()
// 		.withMessage("Organizer is required"),
// 	check("eventStartDate")
// 		.isDate()
// 		.notEmpty()
// 		.withMessage("Event date is required."),
// 	check("eventStartTime")
// 		.isString()
// 		.matches(/^([0-9]{2})\:([0-9]{2})$/)
// 		.notEmpty()
// 		.withMessage("Event start time is required."),
// 	check("eventEndDate")
// 		.isDate()
// 		.notEmpty()
// 		.withMessage("Event end date is required."),
// 	check("eventEndTime")
// 		.isString()
// 		.matches(/^([0-9]{2})\:([0-9]{2})$/)
// 		.notEmpty()
// 		.withMessage("Event end time is required."),

// 	check("bio").isString().notEmpty().withMessage("Bio is required."),
// 	check("desc").isString().notEmpty().withMessage("Description is required."),
// 	check("location")
// 		.isString()
// 		.notEmpty()
// 		.withMessage("Location of the event required."),
// 	check("coverImage").isString().withMessage("Image upload for the event."),
// 	check("place")
// 		.isString()
// 		.notEmpty()
// 		.withMessage("Please enter the address of the event"),
// 	check("eventStartDate")
// 		.isDate()
// 		.notEmpty()
// 		.withMessage("Date must be a valid value")
// 		.bail(),
// 	check("eventEndDate")
// 		.isDate()
// 		.notEmpty()
// 		.withMessage("Date must be a valid value")
// 		.bail(),
// 	check("eventStartTime")
// 		.isString()
// 		.notEmpty()
// 		.withMessage("Please enter start time for the event"),
// 	check("eventEndTime")
// 		.isString()
// 		.notEmpty()
// 		.withMessage("Please enter endtime time for the event"),
// 	// check("name").isString().custom(value => value.replace(/^\s+|\s+$/g).withMessage("Kindly enter the event name."),

// 	(req, res, next) => {
// 		const error = validationResult(req);
// 		if (!error.isEmpty())
// 			return res.status(400).send({
// 				error: error
// 					.array()
// 					.map((item) => `${item.param} Error - ${item.msg}`),
// 			});
// 		next();
// 	},
// ];
