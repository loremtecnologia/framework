function Authorization() { }

Authorization.prototype.Verify = function (req, res, next) {
    if (req.headers.authorization == process.env.AUTHORIZATION_FACEBOOKORCHESTRATOR) {
        next();
    }
    else {

        let pageID;
        if (!req.body.postback && req.body.message.is_echo) {
            pageID = req.body.sender.id
        }
        else {
            pageID = req.body.recipient.id
        }

        firestore.setLog(pageID, null, {
            level: "warning",
            timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
            url: null,
            ip: null,
            file: "authorization.js",
            method: "Verify",
            message: "Erro na verificação do authorization do FacebookOrchestrator.",
            senderID: req.body.sender.id,
            recipientID: req.body.recipient.id,
            meta: { request: req.body, statusCode: 401 }
        })

        res.status(401);
        res.send();
    }
}

module.exports = new Authorization();