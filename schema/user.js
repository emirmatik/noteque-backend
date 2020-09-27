const mongoose = require("mongoose");
const Joi = require("joi");
const noteSchema = require("./note")

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    notes: [noteSchema],
})

const User = new mongoose.model("User", userSchema);

const validateUser = (body) => {
    const schema = Joi.object({
        username: Joi.string().required().min(2).max(15),
        email: Joi.string().email().required(),
        password: Joi.string().min(6),
        notes: Joi.array() // bi bak buraya array mi object mi olacak diye
    })

    const result = schema.validate(body)
    return result;
}

exports.User = User;
exports.validateUser = validateUser;