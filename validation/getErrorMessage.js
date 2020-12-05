
const getErrorMessage = (validation) => {
    return validation.error.details[0].message;
}

module.exports = getErrorMessage;