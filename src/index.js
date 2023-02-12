require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectToDatabase } = require("./config/dbConnection");
const apiRoutes = require("./routes");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5500;

app.use(express.json({ extended: true }));

app.use("/api", apiRoutes);

app.use((req, res, next) => {
	const error = new Error();
	error.name = "Not Found";
	error.status = 400;
	error.message = "Route not found, please try a valid endpoint";
	next(error);
});

app.use((err, req, res, next) => {
	res.json({
		status: err.status || 500,
		message: err.message,
		stack: err.stack,
	});
});

connectToDatabase();
app.listen(PORT, () => {
	console.log(`Server is live and running on port ${PORT}`);
});
