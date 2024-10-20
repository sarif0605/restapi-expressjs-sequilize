const multer = require("multer");

const FILE_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = FILE_TYPE[file.mimetype];
    let uploadError = new Error("Invalid image type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: (req, file, cb) => {
    const extension = FILE_TYPE[file.mimetype];
    const uniqueFileImage = `${file.fieldname}-${Date.now()}.${extension}`;
    cb(null, uniqueFileImage);
  },
});

exports.uploadOptions = multer({ storage: storage });
