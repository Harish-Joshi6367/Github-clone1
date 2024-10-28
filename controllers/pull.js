const fs = require("fs").promises;
const path = require("path");
const { S3, S3_BUCKET } = require("../config/aws-config");
const { writeFile } = require("fs");

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".mygit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const data = await S3.listObjectsV2({
      Bucket: S3_BUCKET,
      Prefix: "commits/",
    }).promise();

    const objects = data.Contents;

    for (const object of objects) {
      const key = object.Key;
      const commitsDir = path.join(
        commitsPath,
        path.dirname(key).split("/").pop()
      );

      await fs.mkdir(commitsDir, {recursive:true});

      const params = {
        Bucket: S3_BUCKET,
        Key: key,
      }

      const fileContent = await S3.getObject(params).promise();
      await fs.writeFile(path.join(repoPath, key), fileContent.Body);

    }

    console.log("all Objects pulled from S3.");
  } catch (err) {
    console.error("Unable to Pull : ", err);
  }
}

module.exports = { pullRepo };