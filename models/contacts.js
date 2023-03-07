const fs = require("fs/promises");
const path = require("path");

const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet("1234567890", 3);

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
	try {
		return JSON.parse(await fs.readFile(contactsPath));
	} catch (error) {
		throw new Error(error);
	}
};

const getContactById = async contactId => {
	try {
		const contacts = JSON.parse(await fs.readFile(contactsPath));
		const contactById = contacts.find(contact => contact.id === contactId);

		if (!contactById) {
			return null;
		}

		return contactById;
	} catch (error) {
		throw new Error(error);
	}
};

const removeContact = async contactId => {
	try {
		const contacts = JSON.parse(await fs.readFile(contactsPath));
		const contactById = contacts.find(contact => contact.id === contactId);

		if (!contactById) {
			return null;
		}

		const filteredContacts = contacts.filter(contact => contact.id !== contactId);
		await fs.writeFile(contactsPath, JSON.stringify(filteredContacts));

		return contactById;
	} catch (error) {
		throw new Error(error);
	}
};

const addContact = async ({ name, email, phone }) => {
	try {
		const contacts = JSON.parse(await fs.readFile(contactsPath));
		const newContact = { id: nanoid(), name, email, phone };
		contacts.push(newContact);
		await fs.writeFile(contactsPath, JSON.stringify(contacts));

		return newContact;
	} catch (error) {
		throw new Error(error);
	}
};

const updateContact = async (contactId, data) => {
	const contacts = JSON.parse(await fs.readFile(contactsPath));
	const contactIdx = contacts.findIndex(contact => contact.id === contactId);

	if (contactIdx === -1) {
		return null;
	}

	contacts[contactIdx] = { id: contactId, ...data };
	await fs.writeFile(contactsPath, JSON.stringify(contacts));

	return contacts[contactIdx];
};

module.exports = {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
};
