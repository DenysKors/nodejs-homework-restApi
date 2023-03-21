const { model, Schema } = require("mongoose");
const Joi = require("joi");

const contactSchema = new Schema({
	name: {
		type: String,
		required: [true, "Set name for contact"],
	},
	email: {
		type: String,
		required: [true, "Set email for contact"],
	},
	phone: {
		type: String,
		required: [true, "Set phone for contact"],
	},
	favorite: {
		type: Boolean,
		default: false,
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: "user",
		required: [true, "Contact must have an owner"],
	},
});

const joiContactsSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	phone: Joi.string().required(),
	favorite: Joi.boolean(),
});

const joiFavoriteStatusSchema = Joi.object({
	favorite: Joi.boolean().required(),
});

const Contact = model("contact", contactSchema);

module.exports = { Contact, joiContactsSchema, joiFavoriteStatusSchema };
