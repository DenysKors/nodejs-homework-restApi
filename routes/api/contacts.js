const express = require("express");
const { joiContactsSchema, joiFavoriteStatusSchema } = require("../../models/contactModel");

const {
	listContacts,
	getContactById,
	addContact,
	removeContact,
	updateContact,
	updateStatusContact,
} = require("../../models/contacts");

const router = express.Router();

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
		const { error } = joiContactsSchema.validate(req.body);
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
		const { error } = joiContactsSchema.validate(req.body);
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

router.patch("/:contactId/favorite", async (req, res, next) => {
	try {
		const { error } = joiFavoriteStatusSchema.validate(req.body);
		if (error) {
			error.status = 400;
			error.message = "missing field favorite";
			throw error;
		}

		const { contactId } = req.params;
		const { favorite } = req.body;
		const updatedContact = await updateStatusContact(contactId, { favorite });
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
