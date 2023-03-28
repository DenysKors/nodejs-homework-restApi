const path = require("path");
const multer = require("multer");

const tempPath = path.join(__dirname, "..", "tmp");

const multerStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, tempPath);
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
	limits: {
		fileSize: 1024,
	},
});

const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		cb(new Error("Upload only images"), false);
	}
};

exports.uploadUserAvatar = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
}).single("avatar");
