// Core Imports
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

// Custom Imports
const CONFIG = require("./../config");

aws.config.update({
  secretAccessKey: CONFIG.AWS_SECRET_KEY,
  accessKeyId: CONFIG.AWS_ACCESS_KEY,
  region: CONFIG.AWS_S3_BUCKET_REGION,
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: CONFIG.AWS_S3_BUCKET_NAME,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "TEXTING_META_DATA!" });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

module.exports = upload;
