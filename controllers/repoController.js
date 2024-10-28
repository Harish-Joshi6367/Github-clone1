const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

const createRepository = async (req, res) => {
  const { owner, name, issues, content, description, visibility } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ error: "Repository name is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    const newRepository = new Repository({
      owner,
      name,
      issues,
      content,
      description,
      visibility,
    });

    const result = await newRepository.save();

    res.status(201).json({
      message: "Repository created",
      repositoryID: result._id,
    });
  } catch (err) {
    console.error("Error during repository creation : ", err);
    res.status(500).send("Server error");
  }
};

const getAllRepository = async (req, res) => {
  try {
    const repositoires = await Repository.find({})
      .populate("issues")
      .populate("owner");

    res.json(repositoires);
  } catch (err) {
    console.error("Error during fetching repositories : ", err);
    res.status(500).send("Server error");
  }
};

const fetchRepositoryByName = async (req, res) => {
    const { name } = req.params;

    try {
      const repository = await Repository.find({ name })
        .populate("owner")
        .populate("issues");
  
      res.json(repository);
    } catch (err) {
      console.error("Error during fetching repository : ", err);
      res.status(500).send("Server error");
    }
};

const fetchRepositoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const repository = await Repository.find({ _id: id })
      .populate("owner")
      .populate("issues");

    res.json(repository);
  } catch (err) {
    console.error("Error during fetching repository : ", err);
    res.status(500).send("Server error");
  }
};

const fetchRepositoryForCurrentUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const repositories = await Repository.find({owner: userId});

    if(!repositories || repositories.length==0) {
        return res.status(400).json({message: "User Repositories not found"});
    }

    res.json({message: "Repositories founs", repositories});
  } catch (err) {
    console.error("Error during fetching user repositories : ", err);
    return res.status(500).json({error: "Server error"});
  }
};

const updateRepositoryById = async (req, res) => {
    const {id} = req.params;
    const {description, content} = req.body;
  
    try {
        const repository = Repository.findById(id);

        if(!repository) {
            res.status(400).json({message: "Repository not found"});
        }
        repository.content.push(content);
        repository.description = description;

        const updatedRepo = await repository.save();

        res.json({message: "Repository updated succesfully", updatedRepo});

    } catch (err) {
      console.error("Error during updating repository : ", err);
      res.status(500).send("Server error");
    }
};

const toggleVisibilityById = async (req, res) => {
  const {id} = req.params;  
  
    try {
        const repository = Repository.findById(id);

        if(!repository) {
            res.status(400).json({message: "Repository not found"});
        }

        repository.visibility = !repository.visibility;
        
        const updatedRepo = await repository.save();

        res.json({message: "Repository visibility toggled succesfully", updatedRepo});
        
    } catch (err) {
      console.error("Error during toggling visibility : ", err);
      res.status(500).send("Server error");
    }
};

const deleteRepositoryById = async (req, res) => {
  const {id} = req.params;

  try {
    const repository = await Repository.findByIdAndDelete(id);

    if(!repository) {
        res.status(400).json({message: "Repository not found"});
    }

    res.json({message: "Repository Deleted Successfully"});
  } catch (err) {
      console.error("Error during toggling visibility : ", err);
      res.status(500).send("Server error");
    }
};

module.exports = {
  createRepository,
  getAllRepository,
  fetchRepositoryByName,
  fetchRepositoryById,
  fetchRepositoryForCurrentUser,
  updateRepositoryById,
  toggleVisibilityById,
  deleteRepositoryById,
};
