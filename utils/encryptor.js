const brypt = require("bcryptjs");

const encrypt = (plainString) => {
    return brypt.hashSync(plainString, brypt.genSaltSync(10));
}

const compare = (plainString, hashString) => {
    return brypt.compareSync(plainString, hashString)
}

module.exports = {
    encrypt,
    compare
}