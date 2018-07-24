function Cryptography() {}

var crypto = require('crypto');
var  algorithm = 'aes-256-ctr';
var privateKey = '1mGiwgT1nlfF1y4iq';

Cryptography.prototype.Decrypt = function(password) {
    var decipher = crypto.createDecipher(algorithm, privateKey);
    var dec = decipher.update(password, 'base64', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

Cryptography.prototype.Encrypt = function(password) {
    var cipher = crypto.createCipher(algorithm, privateKey);
    var crypted = cipher.update(password, 'utf8', 'base64');
    crypted += cipher.final('base64');
    return crypted;
}

module.exports = new Cryptography();