const { User } = require("./userModel");
const jwt = require("jsonwebtoken");

const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

const registerUser = async ({ password, email, subscription }) => {
	try {
		const existedUser = await User.findOne({ email });

		if (existedUser) {
			return null;
		}

		const createdUser = await User.create({ password, email, subscription });

		createdUser.password = undefined;

		return createdUser;
	} catch (error) {
		throw new Error(error);
	}
};

const loginUser = async ({ password, email }) => {
	try {
		const user = await User.findOne({ email }).select("+password");

		if (!user) {
			return null;
		}

		const isPasswordValid = await user.checkPassword(password);

		if (!isPasswordValid) {
			return null;
		}

		const token = signToken(user._id);

		const setToken = await User.findByIdAndUpdate(user._id, { token }, { new: true });

		return setToken;
	} catch (error) {
		throw new Error(error);
	}
};

const logoutUser = async _id => {
	try {
		await User.findByIdAndUpdate(_id, { token: null });
	} catch (error) {
		throw new Error(error);
	}
};

const updateUserSubscr = async (_id, { subscription }) => {
	try {
		const updatedSubscr = await User.findByIdAndUpdate(_id, { subscription }, { new: true });
		return updatedSubscr;
	} catch (error) {
		throw new Error(error);
	}
};

module.exports = {
	registerUser,
	loginUser,
	logoutUser,
	updateUserSubscr,
};
