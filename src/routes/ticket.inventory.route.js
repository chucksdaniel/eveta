const router = require("express").Router();

const { userAuthentication, isAdmin, isVendor } = require("../utils/auth");
const {
	getAllTicketsOfEvent,
	getAllSoldTicketsOfEvent,
	getAllUnSoldTicketsOfEvent,
	getAllUnSoldTickets,
	getAllSoldTickets,
	getAllTickets,
} = require("../controllers/inventory.controller");

/**
 * @route      GET /api/v1/tickets/inventories/all
 * @desc       An endpoint to get all tickets of all events
 * @access     Private - Restricted to only vendors
 */

router.get("/all", userAuthentication, isAdmin, getAllTickets);

/**
 * @route      GET /api/v1/tickets/inventories/sold
 * @desc       An endpoint to get all sold tickets of all events
 * @access     Private - Restricted to only vendors
 */

router.get("/sold", userAuthentication, isAdmin, getAllSoldTickets);

/**
 * @route      GET /api/v1/tickets/inventories/unsold
 * @desc       An endpoint to get all unsold tickets of all events
 * @access     Private - Restricted to only vendors
 */

router.get("/unsold", userAuthentication, isAdmin, getAllUnSoldTickets);

/**
 * @route      GET /api/v1/tickets/inventories/:eventId
 * @desc       An endpoint to get all tickets of an event
 * @access     Private - Restricted to only vendors
 */

router.get("/:eventId", userAuthentication, isAdmin, getAllTicketsOfEvent);

/**
 * @route      GET /api/v1/tickets/inventories/sold/:eventId
 * @desc       An endpoint to get all sold out tickets of an event
 * @access     Private - Restricted to only vendors
 */

router.get(
	"/sold/:eventId",
	userAuthentication,
	isAdmin,
	getAllSoldTicketsOfEvent
);

/**
 * @route      GET /api/v1/tickets/inventories/unsold/:eventId
 * @desc       An endpoint to get all tickets unsold for an event
 * @access     Private - Restricted to only vendors
 */

router.get(
	"/unsold/:eventId",
	userAuthentication,
	isAdmin,
	getAllUnSoldTicketsOfEvent
);

module.exports = router;
