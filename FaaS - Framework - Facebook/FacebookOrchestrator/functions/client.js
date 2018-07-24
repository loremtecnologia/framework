function Client() { }

Client.prototype.Authentication = function (req, res, next) {
    var client = require("./client.json");

    let pageID;
    if (!req.body.postback && req.body.message.is_echo) {
        pageID = req.body.sender.id
    }
    else {
        pageID = req.body.recipient.id
    }
    
    const _client = client.filter(item => item.pageID == pageID)[0];

    if (_client) {
        res.CLIENT = _client;
        next();
    }
    else {
        firestore.setLog(pageID, null, {
            level: "warning",
            timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
            url: null,
            ip: null,
            file: "client.js",
            method: "Authentication",
            message: "Erro ao pegar tokens do FacebookOrchestrator.",
            senderID: req.body.sender.id,
            recipientID: req.body.recipient.id,
            meta: { request: req.body, statusCode: 401 }
        })

        res.status(401);
        res.send();
    }
}

module.exports = new Client();