require("dotenv").config();
const AWS = require("aws-sdk");

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region:"ap-south-1"
});

const S3 = new AWS.S3();
const S3_BUCKET = "githubprojectfilebucket";

module.exports = {S3, S3_BUCKET};