const express = require("express");
const { joiRegistrUserSchema, joiLoginSchema, joiSubscrSchema, joiVerifySchema } = require("../../models/userModel");
const {
	registerUser,
	loginUser,
	logoutUser,
	updateUserSubscr,
	updateUserAvatar,
	getUserByVerifyToken,
	getUserByEmail,
} = require("../../models/users");
const { authProtect } = require("../../middlewares/authMiddleware");
const { uploadUserAvatar } = require("../../middlewares/userMiddleware");

const router = express.Router();

router.post("/register", async (req, res, next) => {
	const { password, email, subscription } = req.body;
	try {
		const { error } = joiRegistrUserSchema.validate({ password, email, subscription });

		if (error) {
			error.status = 400;
			throw error;
		}
		const newUser = await registerUser({ password, email, subscription });

		if (!newUser) {
			const error = new Error("Email in use");
			error.status = 409;
			throw error;
		}
		res.status(201).json({
			status: "success",
			code: 201,
			user: {
				email: newUser.email,
				subscription: newUser.subscription,
				avatarURL: newUser.avatarURL,
			},
		});
	} catch (error) {
		next(error);
	}
});

router.post("/login", async (req, res, next) => {
	const { password, email } = req.body;
	try {
		const { error } = joiLoginSchema.validate({ password, email });
		if (error) {
			error.status = 400;
			throw error;
		}
		const loginedUser = await loginUser({ password, email });
		if (!loginedUser) {
			const error = new Error("Email/password is wrong or verification needed");
			error.status = 401;
			throw error;
		}
		res.status(200).json({
			status: "success",
			code: 200,
			token: loginedUser.token,
			user: {
				email: loginedUser.email,
				subscription: loginedUser.subscription,
			},
		});
	} catch (error) {
		next(error);
	}
});

router.post("/logout", authProtect, async (req, res, next) => {
	const { _id } = req.user;
	try {
		await logoutUser(_id);
		res.status(204).json();
	} catch (error) {
		next(error);
	}
});

router.get("/current", authProtect, async (req, res, next) => {
	const { email, subscription } = req.user;
	try {
		res.status(200).json({
			status: "success",
			code: 200,
			user: {
				email,
				subscription,
			},
		});
	} catch (error) {
		next(error);
	}
});

router.patch("/subscription", authProtect, async (req, res, next) => {
	try {
		const { error } = joiSubscrSchema.validate(req.body);
		if (error) {
			error.status = 400;
			throw error;
		}
		const { subscription } = req.body;
		const { _id } = req.user;
		const updatedUserSubscr = await updateUserSubscr(_id, { subscription });
		res.status(200).json({
			status: "success",
			code: 200,
			data: {
				result: updatedUserSubscr.subscription,
			},
		});
	} catch (error) {
		next(error);
	}
});

router.patch("/avatars", authProtect, uploadUserAvatar, updateUserAvatar);

router.get("/verify/:verificationToken", async (req, res, next) => {
	const { verificationToken } = req.params;
	try {
		const userByVerifyToken = await getUserByVerifyToken(verificationToken);
		if (!userByVerifyToken) {
			const error = new Error("User not found");
			error.status = 404;
			throw error;
		}
		res.status(200).json({
			status: "success",
			code: 200,
			message: "Verification successful",
		});
	} catch (error) {
		next(error);
	}
});

router.post("/verify", async (req, res, next) => {
	try {
		const { error } = joiVerifySchema.validate(req.body);
		if (error) {
			error.status = 400;
			throw error;
		}

		const userByEmail = await getUserByEmail(req.body);

		if (!userByEmail) {
			const error = new Error("Verification has already been passed");
			error.status = 404;
			throw error;
		}

		res.status(200).json({
			status: "success",
			code: 200,
			message: "Verification email sent",
		});
	} catch (error) {
		next(error);
	}
});

module.exports = router;
