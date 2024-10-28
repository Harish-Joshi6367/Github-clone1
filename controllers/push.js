const fs = require("fs").promises;
const path = require("path");
const { S3, S3_BUCKET } = require("../config/aws-config");

async function pushRepo() {
    const repoPath = path.resolve(process.cwd(), ".mygit");
    const commitsPath = path.join(repoPath, "commits");

    try {
        const commitsDir = await fs.readdir(commitsPath);
        for(const commitDir of commitsDir) {
            const commitPath = path.join(commitsPath, commitDir);
            const files = await fs.readdir(commitPath);

            for(const file of files) {
                const filePath = path.join(commitPath, file);
                const fileContent = await fs.readFile(filePath);
                const params = {
                    Bucket: S3_BUCKET,
                    Key: `commits/${commitDir}/${file}`,
                    Body: fileContent
                }

                await S3.upload(params).promise();
            }
        }

        console.log("All commits Pushed to S3.");

    } catch(err) {
        console.error("Error Pushing to S3 : ", err)
    }
}

module.exports = {pushRepo};