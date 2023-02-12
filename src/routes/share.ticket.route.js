const router = require("express").Router();

const {
	shareTableTicket,
	getAllSharedTickets,
	getAllSharedTableTicket,
	getMySharedTicket,
	redeemSharedTableTicket,
} = require("../controllers/share.ticket.controller");
const { ticketSharingValidator } = require("../validators/ticket.validator");
const { userAuthentication, isAdmin, isUser } = require("../utils/auth");

// router.get("/", userAuthentication, isAdmin, getAllSharedTickets);

router.post(
	"/table",
	ticketSharingValidator,
	userAuthentication,
	shareTableTicket
);

router.get("/table", userAuthentication, isAdmin, getAllSharedTableTicket);

router.get("/table/user", userAuthentication, getMySharedTicket);

router.post(
	"/table/user/redeem/:ticketId",
	userAuthentication,
	redeemSharedTableTicket
);

module.exports = router;
