const { Contact } = require("../models/contactModel");

const listContacts = async (_id, page, limit, favoriteOption) => {
	try {
		const paginationPage = Number(page);
		const paginationLimit = Number(limit);
		const skip = (paginationPage - 1) * paginationLimit;

		const allContacts = await Contact.find({ favorite: favoriteOption, owner: _id }, "", {
			skip,
			limit: paginationLimit,
		}).populate("owner", "_id email subscription");

		return allContacts;
	} catch (error) {
		throw new Error(error);
	}
};

const getContactById = async contactId => {
	try {
		const contactById = await Contact.findById(contactId);
		return contactById;
	} catch (error) {
		throw new Error(error);
	}
};

const removeContact = async contactId => {
	try {
		await Contact.findByIdAndDelete(contactId);
	} catch (error) {
		throw new Error(error);
	}
};

const addContact = async ({ name, email, phone, favorite, owner }) => {
	try {
		const createdContact = await Contact.create({ name, email, phone, favorite, owner });
		return createdContact;
	} catch (error) {
		throw new Error(error);
	}
};

const updateContact = async (contactId, { name, email, phone }) => {
	try {
		const updatedContact = await Contact.findByIdAndUpdate(contactId, { name, email, phone });
		return updatedContact;
	} catch (error) {
		throw new Error(error);
	}
};

const updateStatusContact = async (contactId, { favorite }) => {
	try {
		const updatedStatus = await Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });
		return updatedStatus;
	} catch (error) {
		throw new Error(error);
	}
};

module.exports = {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
	updateStatusContact,
};
