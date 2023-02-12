const axios = require("axios");
const ShareTableTicketModel = require("../models/ShareTableTicket");
const TableTicket = require("../models/TableTicket");
const Ticket = require("../models/Ticket");

exports.getTableTickets = async () => {
	const tickets = await TableTicket.find();
	return tickets;
};

exports.checkTableTickets = async (id, userId) => {
	const tickets = await Ticket.find({
		tableTicketId: id,
		owner: userId,
		sharedWith: null,
		isUsedUp: false,
	});
	return tickets;
};

const sendEmail = async (email, title, emailBody) => {
	try {
		const headers = {
			"Content-Type": "application/json",
		};
		const params = {
			email: email,
			title: title,
			emailBody: emailBody,
		};
		const sendEmail = await axios.post(
			`https://account.server.wonderlandvendor.com/api/v1/email/send`,
			params,
			{ headers: headers }
		);
		console.log(sendEmail.data);
		return sendEmail.data;
	} catch (error) {
		console.log(error);
		return error;
	}
};

exports.shareTableTicketToUser = async (receipientEmail, ticket, sharer) => {
	try {
		let subject = "Wonderland ticket shared with You";
		let body = `${sharer.fullName} has shared wonderland ticket with you, Please login or sign up on https://user.wonderlandvendor.com/ to claim your ticket`;
		const send = await sendEmail(receipientEmail, subject, body);
		const assignTo = await Ticket.findOneAndUpdate(
			{ _id: ticket._id },
			{ sharedWith: receipientEmail },
			{ new: true }
		);
		console.log(assignTo);
		const saveShareTableTicket = new ShareTableTicketModel({
			email: receipientEmail,
			ticketId: ticket._id,
			ownerId: sharer.id,
		});

		return "success";
	} catch (err) {
		console.log(err);
		return err;
	}
};

exports.checkTicket = async (user) => {
	const tickets = await Ticket.find({ owner: user });
};

exports.shareTicketToUser = async (receipientEmail, ticket, sharer) => {
	try {
		let subject = "Wonderland ticket shared with You";
		let body = `${sharer.fullName} has shared wonderland ticket with you, Please login or sign up on https://user.wonderlandvendor.com/ to claim your ticket`;
		const send = await sendEmail(receipientEmail, subject, body);
		const assignTo = await Ticket.findOneAndUpdate(
			{ _id: ticket._id },
			{ sharedWith: receipientEmail },
			{ new: true }
		);
		console.log(assignTo);
		const saveShareTableTicket = new ShareTableTicketModel({
			email: receipientEmail,
			ticketId: ticket._id,
			ownerId: sharer.id,
		});

		return "success";
	} catch (err) {
		console.log(err);
		return err;
	}
};

exports.getMySharedTicket = async (email) => {
	const ticket = await ShareTableTicketModel.findOne({
		email: email,
		isRedeemed: false,
	});
	return ticket;
};

exports.getSharedTickets = async () => {
	const tickets = await ShareTableTicketModel.find();
	return tickets;
};

const updateShareTableTicket = async (user) => {
	const updated = await ShareTableTicketModel.findOneAndUpdate(
		{
			email: user.email,
		},
		{ ownerId: user.id, isRedeemed: true },
		{ new: true }
	);
	return updated;
};

const assignUserTableTicket = async (ticket, userEmail) => {
	const assignToUser = await Ticket.findOneAndUpdate(
		{ tableTicketId: ticket._id, sharedWith: userEmail },
		{ assignStatus: "assigned" },
		{ new: true }
	);

	return assignToUser;
};

exports.redeemMySharedTicket = async (ticket, user) => {
	try {
		const updateSharedTableTicke = await updateShareTableTicket(user);
		// if(!updateShareTableTicket) throw error

		const assignedToUser = await assignUserTableTicket(ticket, user.email);
		return assignedToUser;
	} catch (error) {
		throw error;
	}
};
