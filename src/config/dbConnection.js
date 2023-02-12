const mongoose = require("mongoose");
require("dotenv").config();
const MONGODB_URL = process.env.MONGODB_URL;

const connectToDatabase = () => {
	mongoose.connect(MONGODB_URL);
	const database = mongoose.connection;
	database.on("connected", async () => {
		console.log("Database now Connected...");
	});

	mongoose.connection.on("error", (err) => {
		console.log("An error occurred while connecting to MongoDB");
		console.log(err);
	});
};

module.exports = { connectToDatabase };
