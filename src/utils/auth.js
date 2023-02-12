const jwt = require("jsonwebtoken");

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const userAuthentication = (req, res, next) => {
	const bearerHeader = req.headers.authorization;
	if (!bearerHeader) {
		res.status(403).json({
			status: "access denied",
			msg: "Oops! Something sure went wrong... You're not allowed in here!",
		});
		return;
	}
	const bearer = bearerHeader.split(" ");
	// console.log(JWT_SECRET);
	// console.log(bearer);
	const [tops, token] = bearer;
	jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
		if (err) {
			// console.log(err);
			res.status(401).json({
				status: "access denied",
				msg: "Oops! Your token might be expired...",
			});
			return;
		} else {
			req.user = decodedToken.user;
			console.log(req.user);
			return next();
		}
	});
	// req.token = bearer;
	// console.log(bearer[1]);
};

const isAdmin = async (req, res, next) => {
	console.log(req.user);
	if (req.user.userRole === "admin") {
		console.log(req.user.userRole);
		next();
	} else {
		res.status(401).json({
			status: 401,
			error: "Unauthorized to access this resource",
		});
	}
};

const isUser = async (req, res, next) => {
	if (req.user.userRole === "user") {
		console.log(req.user.userRole);
		next();
	} else {
		console.log(req.user.role);
		res.status(401).json({
			status: 401,
			error: "Unauthorized to access this resource",
		});
	}
};

const isVendor = async (req, res, next) => {
	if (req.user.userRole === "vendor") {
		console.log(req.user.role);
		next();
	} else {
		console.log(req.user.role);
		res.status(401).json({
			status: 401,
			error: "Unauthorized to access this resource",
		});
	}
};

const isWonderlandService = async (req, res, next) => {
	const serviceKey = req.header("api-key");
	if (serviceKey && serviceKey === process.env.API_KEY) {
		return next();
	}
	res.status(401).json({
		status: "access denied",
		msg: "Oops! Your token might be expired...",
	});
};

module.exports = {
	userAuthentication,
	isAdmin,
	isUser,
	isVendor,
	isWonderlandService,
};
