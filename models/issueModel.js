const mongoose = require("mongoose");
const { required } = require("yargs");
const {Schema} = mongoose;

const IssueSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required:true,
    },
    repository: {
        type: Schema.Types.ObjectId,
        ref: "Repository",
    },
    status: {
        type: String,
        enum: ["open", "closed"],
    },
});

const Issue = mongoose.model("Issue", IssueSchema);

module.exports = Issue;