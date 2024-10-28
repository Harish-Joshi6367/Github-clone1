const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ReturnDocument } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

let client;
const uri = process.env.MONGODB_URL;

async function clientConnect() {
  if (!client) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
  }
}

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    await clientConnect();
    const db = client.db("githubclone");
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    };

    const result = await userCollection.insertOne(newUser);

    const token = jwt.sign(
      { id: result.insertId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({ token, userId: result._id });
  } catch (err) {
    console.error("error during signin", err);
    res.send(500).send("server error");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    await clientConnect();
    const db = client.db("githubclone");
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({email});
    if (!user || user==null) {
      res.status(500).json({ message: "Invalid Credential" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(500).json({ message: "Invalid Credential" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error("Error during login : ", err.message);
  }
};

const getAllUsers = async (req, res) => {
  try {
    await clientConnect();
    const db = client.db("githubclone");
    const userCollection = db.collection("users");

    const users = await userCollection.find({}).toArray();
    res.json(users);
  } catch (err) {
    console.error("Error during fething : ", err);
    res.status(500).send("Server Error");
  }
};

const getUserProfile = async (req, res) => {
  const currentId = req.params.id;

  try {
    await clientConnect();
    const db = client.db("githubclone");
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({
      _id: new ObjectId(currentId),
    });

    if (!user) {
      return res.status(404).json({ message: "User Not found!" });
    }

    res.send(user);
  } catch (err) {
    console.error("Error during fething : ", err);
    res.status(500).send("Server Error");
  }
};

const updateUserProfile = async (req, res) => {
  const currentId = req.params.id;
  const { email, password } = req.body;

  try {
    await clientConnect();
    const db = client.db("githubclone");
    const userCollection = db.collection("users");

    const updateFeilds = { email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFeilds.password = hashedPassword;
    }

    const result = await userCollection.findOneAndUpdate(
      {
        _id: new ObjectId(currentId),
      },
      { $set: updateFeilds },
      { ReturnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ message: "User not Found" });
    }

    res.send(result.value);
  } catch (err) {
    console.error("Error during updating : ", err);
    res.status(500).send("Server Error!");
  }
};

const deleteUserProfile = async (req, res) => {
  const currentId = req.params.id;

  try {
    await clientConnect();
    const db = client.db("githubclone");
    const userCollection = db.collection("users");

    const result = await userCollection.deleteOne({
      _id: new ObjectId(currentId),
    });

    if (result.deleteCount == 0) {
      res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User Profile deleted" });
  } catch (err) {
    console.error("Error during deleting : ", err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
