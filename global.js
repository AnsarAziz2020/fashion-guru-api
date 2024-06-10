const crypto = require('crypto');

function generateRandomString(length) {
    const randomBytes = crypto.randomBytes(length);
    return randomBytes.toString('hex');
}

module.exports = {
    generateRandomString,
}