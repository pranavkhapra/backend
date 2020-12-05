const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    address: {
        type: String,
        default: "N/A"
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    assigned_classroom:{
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "student"
    },
    created_date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("students", schema)