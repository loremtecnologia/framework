var LogModel = require('../db/models/log');

function LogController() { }

LogController.prototype.LogInsert = function (level, url, ip, file, method, message, sender, recipient, meta) {
    var newLog = LogModel({
        level: level,
        timestamp: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
        url: url,
        ip: ip,
        file: file,
        method: method,
        message: message,
        senderID: sender,
        recipientID: recipient,
        meta: meta
    });
    newLog.save(function (err, newLog) {

    });
}

module.exports = new LogController();