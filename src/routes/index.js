const express = require("express");
const router = express.Router();

const ticketRoute = require("./ticket.route");
const eventRoute = require("./event.route");
const categoryRoute = require("./category.route");
const ticketInventoryRoute = require("./ticket.inventory.route");
const bookEventRoute = require("./event.book.route");
const dashboardRoute = require("./dashboard.route");
const shareTicketRoute = require("./share.ticket.route");

router.get("/v1/", (req, res) => {
	res.send("Welcome to eVENTA ticketing API");
});

router.use("/v1/events", eventRoute);
router.use("/v1/tickets", ticketRoute);
router.use("/v1/categories", categoryRoute);
router.use("/v1/tickets/inventories", ticketInventoryRoute);
router.use("/v1/events/book", bookEventRoute);
router.use("/v1/dashboard/stat", dashboardRoute);
router.use("/v1/tickets/share", shareTicketRoute);

module.exports = router;
