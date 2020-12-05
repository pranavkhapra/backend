const Joi = require("@hapi/joi")

const changePasswordValidation = Joi.object({
    newPassword: Joi.string().required().regex(/^.*(?=.{10,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/),
})

module.exports = {
    changePasswordValidation
}