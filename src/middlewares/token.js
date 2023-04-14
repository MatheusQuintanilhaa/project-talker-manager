const crypto = require('crypto');

function cryptoToken() {
    return crypto.randomBytes(8).toString('hex');
}

module.exports = cryptoToken;