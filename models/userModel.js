const { model, Schema } = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { USER_SUBSCR_ENUM } = require("../constants/enums");

const PASSWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,32})/;

const userSchema = new Schema(
	{
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: 8,
			select: false,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
		},
		subscription: {
			type: String,
			enum: Object.values(USER_SUBSCR_ENUM),
			default: USER_SUBSCR_ENUM.STARTER,
		},
		token: {
			type: String,
			default: null,
		},
	},
	{ timestamps: true },
);

const joiRegistrUserSchema = Joi.object()
	.options({ abortEarly: false })
	.keys({
		password: Joi.string().regex(PASSWD_REGEX).required(),
		email: Joi.string().email().required(),
		subscription: Joi.string().valid(...Object.values(USER_SUBSCR_ENUM)),
	});

const joiLoginSchema = Joi.object()
	.options({ abortEarly: false })
	.keys({
		password: Joi.string().regex(PASSWD_REGEX).required(),
		email: Joi.string().email().required(),
	});

const joiSubscrSchema = Joi.object({
	subscription: Joi.string().valid(...Object.values(USER_SUBSCR_ENUM)),
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);

	next();
});

userSchema.methods.checkPassword = function (password) {
	return bcrypt.compare(password, this.password);
};

const User = model("user", userSchema);

module.exports = { User, joiRegistrUserSchema, joiLoginSchema, joiSubscrSchema };
