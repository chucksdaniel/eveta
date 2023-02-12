const router = require("express").Router();

const {
	bookEvent,
	getBookedEvents,
	getAllBookedEvents,
} = require("../controllers/book.controller");
const { bookEventValidator } = require("../validators/event.validator");
const { userAuthentication, isAdmin, isVendor } = require("../utils/auth");

/**
 * @route      POST /api/v1/events/book/all
 * @desc       An endpoint for booking an event for vendors
 * @access     Private - Restricted to only vendors
 */
router.get("/all", userAuthentication, isAdmin, getAllBookedEvents);

/**
 * @route      GET /api/v1/events/book
 * @desc       An endpoint for getting book events by vendor
 * @access     Private - Restricted to only vendors
 */
router.get("/vendor", userAuthentication, getBookedEvents);

/**
 * @route      POST /api/v1/events/book
 * @desc       An endpoint for booking an event for vendors
 * @access     Private - Restricted to only vendors
 */
router.post("/", bookEventValidator, userAuthentication, bookEvent);

module.exports = router;
