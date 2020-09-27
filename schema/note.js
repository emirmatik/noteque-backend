const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
    title: String,
    desc: { type: String, required: true },
    media: String,
    isPinned: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = noteSchema;