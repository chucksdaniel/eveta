require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const { connectToDatabase } = require("./config/dbConnection");
const apiRoutes = require("./routes");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5500;

app.use(express.json({ extended: true }));

app.use("/", express.static(path.join(__dirname, "public")));

// app.use(express.static("public")); this still works because it is relative to where server

// Routes
app.use("/", require("./routes/root"));

app.use("/api", apiRoutes);

app.all("*", (req, res) => {
	if (req.accepts("html")) {
		res.sendFile(path.join(__dirname, "views", "404.html"));
	} else if (req.accepts("json")) {
		res.json({ message: "404 Not Found" });
	} else {
		res.type("txt").send("404 Not Found");
	}
});

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
