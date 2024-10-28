const mongoose = require("mongoose");
const {Schema} = mongoose;

const RepositorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type:String,
    },
    visibility: {
        type: Boolean,
    },
    content: [
        {
            type: String,
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    issues:[
        {
            type: Schema.Types.ObjectId,
            ref: "Issue",
        },
    ],
});

const Repository = mongoose.model("Repository", RepositorySchema);

module.exports = Repository;