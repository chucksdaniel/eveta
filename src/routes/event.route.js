const express = require("express");
const router = express.Router();

const {
	createEvent,
	getAllEvents,
	getAllUpcomingEvents,
	getUserNextEvents,
	getEventById,
	getAllEventsByCategoryName,
	getAllEventsByCategoryId,
	getEventByEventName,
	updateEvent,
	deleteEvent,
} = require("../controllers/event.contoller");

const { createEventValidator } = require("../validators/event.validator");

const { userAuthentication, isAdmin, isUser } = require("../utils/auth");

/**
 * @route      GET /api/v1/events
 * @desc       An endpoint for getting all events
 * @access     Private - Restricted to only vendors
 */
router.get("/", userAuthentication, getAllEvents);

/**
 * @route      GET /api/v1/events/upcoming
 * @desc       An endpoint for getting all upcoming events
 * @access     Public - Can display event on the landing page
 */
router.get("/upcoming", getAllUpcomingEvents);

/**
 * @route      GET /api/v1/events/users/next/event
 * @desc       An endpoint for getting users next events
 * @access     Public - Can display event on the landing page
 */
router.get("/users/next/event", userAuthentication, isUser, getUserNextEvents);

/**
 * @route      POST /api/v1/events
 * @desc       An endpoint for Create events
 * @access     Private - Restricted to only vendors
 */

router.post(
	"/",
	createEventValidator,
	userAuthentication,
	isAdmin,
	createEvent
);

/**
 * @route      GET /api/v1/events/category/name
 * @desc       An endpoint for getting events by category
 * @access     Private - Restricted to only vendors
 */
router.get("/category/name/:catName", getAllEventsByCategoryName);

/**
 * @route      GET /api/v1/events/category/name
 * @desc       An endpoint for getting events by category
 * @access     Private - Restricted to only vendors
 */
router.get(
	"/category/id/:categoryId",
	userAuthentication,
	getAllEventsByCategoryId
);

/**
 * @route      GET /api/v1/events/name/:eventName
 * @desc       An endpoint for getting events by event name
 * @access     Private - Restricted to only vendors
 */
router.get("/name/:eventName", userAuthentication, getEventByEventName);

/**
 * @route      GET /api/v1/events/:eventId
 * @desc       An endpoint for getting an event by eventId
 * @access     Private - Restricted to only vendors
 */
router.get("/:eventId", getEventById);

/**
 * @route      PATCH /api/v1/events/:eventId
 * @desc       An endpoint for editting an event
 * @access     Private - Restricted to only Admin
 */
router.patch(
	"/:eventId",
	createEventValidator,
	userAuthentication,
	isAdmin,
	updateEvent
);

/**
 * @route      DELETE /api/v1/events/:eventId
 * @desc       An endpoint for deleting an event
 * @access     Private - Restricted to only Admin
 */
router.delete("/:eventId", userAuthentication, isAdmin, deleteEvent);

module.exports = router;
