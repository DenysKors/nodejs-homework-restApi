const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

const authProtect = async (req, res, next) => {
	try {
		const token = req.headers.authorization?.startsWith("Bearer") && req.headers.authorization.split(" ")[1];

		if (!token) {
			const error = new Error("Not authorized");
			error.status = 401;
			throw error;
		}

		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		const currentUser = await User.findById(decodedToken.id);

		if (!currentUser || !currentUser.token) {
			const error = new Error("Not authorized");
			error.status = 401;
			throw error;
		}

		req.user = currentUser;
		next();
	} catch (error) {
		if (error.message === "invalid signature" || error.message === "jwt expired") {
			error.status = 401;
		}
		next(error);
	}
};

module.exports = {
	authProtect,
};
