const Joi = require("@hapi/joi")

const addTeacherValidator = Joi.object({
    name: Joi.string().required(),
    phone_number: Joi.string().required(),
    dob: Joi.string().isoDate().required(),
    address: Joi.string().required(),
    email: Joi.string().email().regex(/^[a-z0-9](\.?[a-z0-9]){5,}@teacher\.com$/).required(),
    password: Joi.string().required(),
    assigned_classroom: Joi.string().required()
})

module.exports = {
    addTeacherValidator
}