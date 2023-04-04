require("dotenv").config();
const sgMail = require("@sendgrid/mail");

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

exports.sendEmail = async (email, verificationToken) => {
	try {
		const msg = {
			to: email,
			from: "ned.core750@gmail.com",
			subject: "Welcome to Contacts App!",
			text: `Congratulations, you are registered. Now you need to verify this email. Click this link: http://localhost:3000/api/users/verify/${verificationToken}`,
			html: `<strong>Congratulations, you are registered. Now you need to verify this email by clicking <a href=http://localhost:3000/api/users/verify/${verificationToken}>VERIFY</a></strong>`,
		};

		await sgMail.send(msg);
	} catch (error) {
		throw new Error();
	}
};
