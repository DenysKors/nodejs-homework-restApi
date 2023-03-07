const express = require("express");
const Joi = require("joi");

const { listContacts, getContactById, addContact, removeContact, updateContact } = require("../../models/contacts");

const router = express.Router();

const postContactsSchema = Joi.object({
	id: Joi.string(),
	name: Joi.string().required(),
	email: Joi.string().min(4).required(),
	phone: Joi.string().required(),
});

router.get("/", async (req, res, next) => {
	try {
		const contacts = await listContacts();
		res.status(200).json({
			status: "success",
			code: 200,
			data: {
				contacts,
			},
		});
	} catch (error) {
		next(error);
	}
});

router.get("/:contactId", async (req, res, next) => {
	try {
		const { contactId } = req.params;
		const contactById = await getContactById(contactId);
		if (!contactById) {
			const error = new Error("Not found");
			error.status = 404;
			throw error;
		}
		res.status(200).json({
			status: "success",
			code: 200,
			data: {
				contactById,
			},
		});
	} catch (error) {
		next(error);
	}
});

router.post("/", async (req, res, next) => {
	try {
		const { error } = postContactsSchema.validate(req.body);
		if (error) {
			error.status = 400;
			error.message = "missing required name field";
			throw error;
		}
		const newContact = await addContact(req.body);
		res.status(201).json({
			status: "success",
			code: 201,
			data: {
				newContact,
			},
		});
	} catch (error) {
		next(error);
	}
});

router.delete("/:contactId", async (req, res, next) => {
	try {
		const { contactId } = req.params;
		const removedContact = await removeContact(contactId);
		if (!removedContact) {
			const error = new Error("Not found");
			error.status = 404;
			throw error;
		}
		res.status(200).json({
			status: "contact deleted",
			code: 200,
		});
	} catch (error) {
		next(error);
	}
});

router.put("/:contactId", async (req, res, next) => {
	try {
		const { error } = postContactsSchema.validate(req.body);
		if (error) {
			error.status = 400;
			error.message = "missing fields";
			throw error;
		}

		const { contactId } = req.params;
		const updatedContact = await updateContact(contactId, req.body);
		if (!updatedContact) {
			const error = new Error("Not found");
			error.status = 404;
			throw error;
		}
		res.status(200).json({
			status: "success",
			code: 200,
			data: {
				updatedContact,
			},
		});
	} catch (error) {
		next(error);
	}
});

module.exports = router;
