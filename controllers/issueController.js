const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

const createIssue = async (req, res) => {
    const {title, description} = req.body;
    const {id} = req.params;

    try {
        const issue = new Issue({
            title,
            description,
            repository: id,
        });

        await issue.save();

        res.status(201).json({issue});
    }catch(err) {
        console.error("Error during issue creation : ", err);
        res.status(500).send("Server error");
    }
}

const updateIssueById = async (req, res) => {
    const {id} = req.params;
    const {title, description, status} = req.body;

    try {
        const issue = await Issue.findById(id);

        if(!issue) {
            return res.status(404).json({error: "Issue Not found"});
        }

        issue.title = title;
        issue.description = description;
        issue.status = status;

        await issue.save();

        res.json(issue);
    } catch(err) {
        console.error("Error during issue updation : ", err);
        res.status(500).send("Server error");
    }
}

const deleteIssueById = async (req, res) => {
    const {id} = req.params;

    try {
        const issue = Issue.findByIdAndDelete(id);

        if(!issue) {
            return res.status(404).json({error: "Issue Not found"});
        }

        res.json({message: "Issue deleted"});
    } catch(err) {
        console.error("Error during issue deletion : ", err);
        res.status(500).send("Server error");
    }
}

const getAllIssues = async (req, res) => {
    const {id} = req.params;

    try {
        const issues = Issue.find({repository: id});

        if(!issues) {
            return res.status(404).json({error: "Issue Not found"});
        }

        res.status(200).send(issues);
    } catch(err) {
        console.error("Error during issue deletion : ", err);
        res.status(500).send("Server error");
    }
}

const getIssueById = async (req, res) => {
    const {id} = req.params;

    try {
        const issue = Issue.findById(id);

        if(!issue) {
            return res.status(404).json({error: "Issue Not found"});
        }

        res.status(200).send(issue);
    } catch(err) {
        console.error("Error during issue deletion : ", err);
        res.status(500).send("Server error");
    }
}

module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssueById
};