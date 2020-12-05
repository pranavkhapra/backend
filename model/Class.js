const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    class_name: {
        type: String,
        required: true,
        unique: true
    },
    created_date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("classes", schema)