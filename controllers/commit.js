const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

async function commitRepo(message) {
  const repoPath = path.resolve(process.cwd(), ".mygit");
  const commitPath = path.join(repoPath, "commits");
  const stagedPath = path.join(repoPath, "staging");

  try {
    const commitID = uuidv4();
    const commitDir = path.join(commitPath, commitID);
    await fs.mkdir(commitDir, { recursive: true });

    const files = await fs.readdir(stagedPath);
    for (const file of files) {
      await fs.copyFile(
        path.join(stagedPath, file), // from where copied file
        path.join(commitDir, file)  // where copy to that file
      );
    }

    await fs.writeFile(
      path.join(commitDir, "commit.json"),  //path where creates file
      JSON.stringify({ message, date: new Date().toISOString() }) // data should be in this file
    );

    console.log(`commit ${commitID} created with message ${message}`);
  } catch (err) {
    console.error("File commiting arror:", err);
  }
}

module.exports = { commitRepo };
