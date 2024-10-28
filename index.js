const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const {Server} = require("socket.io");
const mainRouter = require("./routes/main.router");

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");

yargs(hideBin(process.argv))
  .command("start", "Starts a new Server", {}, startServer)
  .command("init", "Initialize a new Repo", {}, initRepo)
  .command(
    "add <filePath>",
    "Add a file into repository",
    (yargs) => {
      yargs.positional("filePath", {
        describe: "File add to staging area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.filePath);
    }
  )
  .command(
    "commit <message>",
    "commit file from staging area into repo",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    }
  )
  .command("push", "Push commits to S3", {}, pushRepo)
  .command("pull", "Pull commits from S3", {}, pullRepo)
  .command(
    "revert <commitID>",
    "Revert to a specific commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "commit ID to revert to",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitID);
    }
  )
  .demandCommand(1, "You need atleast one command")
  .help().argv;

function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(bodyParser.json());
  app.use(express.json());

  const mongoURI = process.env.MONGODB_URL;

  mongoose
    .connect(mongoURI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("Unable to connect : ", err));

  app.use(cors({origin: "*"}));

  app.use("/", mainRouter);

  let user = "test";
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", (userID) => {
      user = userID;
      console.log("--------");
      console.log(user);
      console.log("--------");
      console.log(userID);
    });
  });

  const db = mongoose.connection;

  db.once("open", async () => {
    console.log("CRUD operations called");
    // CRUD operations
  });

  httpServer.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
  });
}
