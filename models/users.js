const path = require("path");
const fs = require("fs").promises;

const Jimp = require("jimp");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { customAlphabet } = require("nanoid");

const { User } = require("./userModel");

const nanoid = customAlphabet("1234567890", 5);

const avatarDir = path.join(__dirname, "..", "public", "avatars");

const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

const registerUser = async ({ password, email, subscription }) => {
	try {
		const existedUser = await User.findOne({ email });

		if (existedUser) {
			return null;
		}

		const avatarURL = gravatar.url(email, { s: 250, d: "retro" });

		const createdUser = await User.create({ password, email, subscription, avatarURL });

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

const updateUserAvatar = async (req, res) => {
	const { path: uploadPath, mimetype } = req.file;
	const { _id: id } = req.user;

	const ext = mimetype.split("/")[1];
	const uniqueFileName = `${id}_${nanoid()}.${ext}`;
	const avatarPath = path.join(avatarDir, uniqueFileName);
	const avatarURL = path.join("/avatars", uniqueFileName);
	try {
		const avatarImg = await Jimp.read(uploadPath);
		avatarImg.resize(250, 250).quality(90).write(uploadPath);

		await fs.rename(uploadPath, avatarPath);

		await User.findByIdAndUpdate(req.user._id, { avatarURL });

		res.status(200).json({
			status: "success",
			code: 200,
			data: {
				result: avatarURL,
			},
		});
	} catch (error) {
		fs.unlink(uploadPath);
		throw new Error(error);
	}
};

module.exports = {
	registerUser,
	loginUser,
	logoutUser,
	updateUserSubscr,
	updateUserAvatar,
};
