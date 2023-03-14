const { Contact } = require("../models/contactModel");

const listContacts = async () => {
	try {
		return await Contact.find();
	} catch (error) {
		throw new Error(error);
	}
};

const getContactById = async contactId => {
	try {
		return await Contact.findById(contactId);
	} catch (error) {
		throw new Error(error);
	}
};

const removeContact = async contactId => {
	try {
		return await Contact.findByIdAndDelete(contactId);
	} catch (error) {
		throw new Error(error);
	}
};

const addContact = async ({ name, email, phone, favorite }) => {
	try {
		return await Contact.create({ name, email, phone, favorite });
	} catch (error) {
		throw new Error(error);
	}
};

const updateContact = async (contactId, { name, email, phone }) => {
	try {
		return await Contact.findByIdAndUpdate(contactId, { name, email, phone });
	} catch (error) {
		throw new Error(error);
	}
};

const updateStatusContact = async (contactId, { favorite }) => {
	try {
		return await Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });
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
