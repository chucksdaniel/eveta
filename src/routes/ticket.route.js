const express = require("express");
const router = express.Router();

const {
	ticketValidator,
	ticketPurchaseValidator,
	ticketIsUsedUpValidator,
} = require("../validators/ticket.validator");
const {
	createTicket,
	getAllTickets,
	getTicketById,
	getTicketsForEvent,
	getAllTicketsForAnEvent,
	getAssignedTicket,
	getAssignedEventTicket,
	getUnassignedTicket,
	purchaseTicket,
	isDiscountCodeValid,
	getMyPurchasedTickets,
	getTableTickets,
	validateTicket,
	getUnassignedEventTickets,
	updateTicketsOfEvent,
	deleteAllTicketsForAnEvent,
	deleteTicketsInBatchOfEvent,
} = require("../controllers/ticket.controller");

const { userAuthentication, isAdmin, isUser } = require("../utils/auth");

/**
 * @route      POST /api/v1/tickets
 * @desc       An endpoint for generating tickets
 * @access     Private - Restricted to only vendors
 */
router.post("/", ticketValidator, userAuthentication, isAdmin, createTicket);

/**
 * @route      GET /api/v1/tickets
 * @desc       An endpoint to get all tickets
 * @access     Private - Restricted to only vendors
 */
router.get("/", userAuthentication, isAdmin, getAllTickets);

/**
 * @route      GET /api/v1/tickets/assigned
 * @desc       An endpoint to get all assigned tickets
 * @access     Private - Restricted to only vendors
 */
router.get("/assigned", userAuthentication, getAssignedTicket);

/**
 * @route      GET /api/v1/tickets/assigned/:eventId
 * @desc       An endpoint to get all assigned tickets
 * @access     Private - Restricted to only vendors
 */
router.get("/assigned/:eventId", userAuthentication, getAssignedEventTicket);

/**
 * @route      GET /api/v1/tickets/unassigned
 * @desc       An endpoint to get all unassigned tickets
 * @access     Private - Restricted to only vendors
 */
// router.get("/unassigned", userAuthentication, getUnassignedTicket);

/**
 * @route      GET /api/v1/tickets/unassigned/:eventId
 * @desc       An endpoint to get all unassigned tickets
 * @access     Private - Restricted to only vendors
 */
router.get("/unassigned/:eventId", getUnassignedEventTickets);

/**
 * @route      GET /api/v1/tickets/:ticketId
 * @desc       An endpoint Get ticket by ID
 * @access     Private - Restricted to only vendors
 */
router.get("/:ticketId", userAuthentication, getTicketById);

/**
 * @route      GET /api/v1/tickets/user
 * @desc       An endpoint Get ticket by ID
 * @access     Private - Restricted to only vendors
 */
router.get("/user/purchase/tickets", userAuthentication, getMyPurchasedTickets);

/**
 * @route      GET /api/v1/tickets//user/purchase/tickets/table/:tableTicketId
 * @desc       An endpoint Get users tickets
 * @access     Private - Restricted to only vendors
 */
router.get(
	"/user/purchase/tickets/table/:tableTicketId",
	userAuthentication,
	getTableTickets
);

/**
 * @route      POST /api/v1/tickets/user/validate
 * @desc       An endpoint to validate a ticket
 * @access     Private - Restricted to only vendors
 */
router.post(
	"/user/validate",
	ticketIsUsedUpValidator,
	userAuthentication,
	validateTicket
);

/**
 * @route      GET /api/v1/tickets/event/:eventId
 * @desc       An endpoint Get ticket by eventID
 * @access     Private - Restricted to only vendors
 */
router.get("/event/:eventId", userAuthentication, getTicketsForEvent);

/**
 * @route      GET /api/v1/tickets/event/name/:eventName
 * @desc       An endpoint Get ticket by event name
 * @access     Private - Restricted to only vendors
 */
router.get("/event/name/:eventName", userAuthentication);

/**
 * @route      GET /api/v1/tickets/purchase
 * @desc       An endpoint to purchase a tickets for an event
 * @access     Private - Restricted to users of the system
 */
router.post(
	"/purchase",
	ticketPurchaseValidator,
	userAuthentication,
	purchaseTicket
);

router.get("/purchase/discount/:discountCode", isDiscountCodeValid);

// router.delete("/event/:id", deleteAllTicketsForAnEvent);

/**
 * @route      PATCH /api/v1/tickets/event/:eventId
 * @desc       An endpoint that update many tickets by eventID
 * @access     Private - Restricted to only Admin
 */
router.patch(
	"/event/:eventId/ticket/:type",
	userAuthentication,
	isAdmin,
	updateTicketsOfEvent
);

/**
 * @route      DELETE /api/v1/tickets/event/:eventId/ticket/:type
 * @desc       An endpoint that delete many tickets type by eventID
 * @access     Private - Restricted to only Admin
 */
router.delete(
	"/event/:eventId/ticket/:type",
	userAuthentication,
	isAdmin,
	deleteTicketsInBatchOfEvent
);

router.get(
	"/event/filter/:eventId",
	userAuthentication,
	isAdmin,
	getAllTicketsForAnEvent
);

module.exports = router;
