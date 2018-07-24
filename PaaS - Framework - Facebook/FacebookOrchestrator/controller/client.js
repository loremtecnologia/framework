function Client() { }

Client.prototype.Authentication = function (req, res, next) {
    var client = require("../config/client.json");

    let pageID;
    if (!req.body.postback && req.body.message.is_echo) {
        pageID = req.body.sender.id
    }
    else {
        pageID = req.body.recipient.id
    }
    
    const _client = client.filter(item => item.Facebook.pageID == pageID)[0];

    if (_client) {
        res.CLIENT = _client;
        next();
    }
    else {
        Log.Add('warning', null, null, "client.js", "Authentication", "Erro ao pegar tokens do FacebookOrchestrator.", req.body.sender.id, req.body.recipient.id, { request: req.body, statusCode: 401 });

        res.status(401);
        res.send();
    }
}

module.exports = new Client();