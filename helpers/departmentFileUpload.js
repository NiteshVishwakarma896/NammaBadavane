const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
require('dotenv').config();

var s3 = new aws.S3();

aws.config.update({
  secretAccessKey: process.env.S3_SECRET,
  accessKeyId: process.env.S3_ACCESS_KEY,
  region: process.env.S3_REGION,
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg" ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG, JPG, and PNG is allowed!"), false);
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    dirname: '/departments',
    acl: "public-read",
    s3:s3,
     limits: { fileSize: 1024 * 1024 * 50 },
    bucket: process.env.S3_BUCKET,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      var fullPath = 'departments/'+ Date.now().toString()+file.originalname;
      cb(null, fullPath);
    },
  }),
});


module.exports = upload;