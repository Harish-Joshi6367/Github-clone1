const fs = require("fs").promises; // this is creates hidden folder and files
const path = require("path");

async function initRepo() {
    const repoPath = path.resolve(process.cwd(), ".mygit");
    const commitspath = path.resolve(repoPath, "commits");

    try {
        await fs.mkdir(repoPath, {recursive: true});
        await fs.mkdir(commitspath, {recursive: true});
        await fs.writeFile(
            path.join(repoPath, "config.json"),
            JSON.stringify({ bucket: process.env.S3_BUCKET })
        );
        console.log("Repository initialized!");
    } catch(err) {
        console.error("Error initializing Repository", err);
    }
}

module.exports = {initRepo}