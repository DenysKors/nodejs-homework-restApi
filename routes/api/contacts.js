const express = require("express");
const { joiContactsSchema, joiFavoriteStatusSchema } = require("../../models/contactModel");
const { authProtect } = require("../../middlewares/authMiddleware");

const {
	listContacts,
	getContactById,
	addContact,
	removeContact,
	updateContact,
	updateStatusContact,
} = require("../../models/contacts");

const router = express.Router();

router.use(authProtect);

router.get("/", async (req, res, next) => {
	try {
		const { _id } = req.user;
		const { page = 1, limit = 20, favorite } = req.query;
		const favoriteOption = favorite ? true : [true, false];
		const contacts = await listContacts(_id, page, limit, favoriteOption);
		res.status(200).json({
			status: "success",
			code: 200,
			data: {
				result: contacts,
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
				result: contactById,
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
		const { _id } = req.user;
		const newContact = await addContact({ ...req.body, owner: _id });
		res.status(201).json({
			status: "success",
			code: 201,
			data: {
				result: newContact,
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
				result: updatedContact,
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
				result: updatedContact,
			},
		});
	} catch (error) {
		next(error);
	}
});

module.exports = router;
