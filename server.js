const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({
	path: "./.env",
});

mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log("Database connection successful"))
	.catch(err => {
		console.log(err.message);
		process.exit(1);
	});

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Server running. Use our API on port: ${port}`);
});
