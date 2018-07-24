var LogController = require('../controller/log');

function Log() { }

Log.prototype.Add = function (level, url, ip, file, method, message, sender, recipient, meta) {

    async.parallel([function (callback) {
        //setTimeout(function () {
        LogController.LogInsert(level, url, ip, file, method, message, sender, recipient, meta);
        //}, 5000);
    }]);
};

Log.prototype.setLog = function (req, res) {

    let pageID
    if (!req.body.postback && req.body.message.is_echo) {
        pageID = req.body.sender.id
    }
    else {
        pageID = req.body.recipient.id
    }  

    async.parallel([function (callback) {
        //setTimeout(function () {
        LogController.LogInsert('conversation', req.originalUrl, req.ip, "log.js", "post", "Requisicao recebida do FacebookWebhook.", req.body.sender.id, req.body.recipient.id, { In: req.body, NLP: res.firstNLP, Out: res.sendedToFacebook });
        //}, 5000);
    }]);
}

module.exports = new Log();