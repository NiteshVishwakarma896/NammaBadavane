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

const fileFilter = (req, profile, cb) => {
  if (profile.mimetype === "image/jpeg" || profile.mimetype === "image/png" || profile.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(new Error("Invalid profile type, only JPEG, JPG and PNG is allowed!"), false);
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    dirname: '/customer-profiles',
    acl: "public-read",
    s3:s3,
    bucket: process.env.S3_BUCKET,
    metadata: function (req, profile, cb) {
      cb(null, { fieldName: profile.fieldname });
    },
    key: function (req, profile, cb) {
      var fullPath = 'customer-profiles/'+ Date.now().toString()+profile.originalname;
      cb(null,fullPath);
    },
  }),
});

module.exports = upload;