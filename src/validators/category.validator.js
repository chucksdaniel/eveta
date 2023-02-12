const { check, validationResult } = require("express-validator");

exports.categoryValidator = [
	check("name")
		.isString()
		.notEmpty()
		.withMessage("Kindly enter the category name."),
	check("imgUrl")
		.isString()
		.notEmpty()
		.withMessage("Kindly enter the image url."),

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
