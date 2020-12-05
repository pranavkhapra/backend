const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "admin"
    },
    verified: {
        type: Boolean,
        default: false
    },
    created_date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("admins", schema)