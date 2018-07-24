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

        Log.Add('warning', null, null, "authorization.js", "Verify", "Erro na verificação do authorization do FacebookOrchestrator.", req.body.sender.id, req.body.recipient.id, { request: req.body, statusCode: 401 });

        res.status(401);
        res.send();
    }
}

module.exports = new Authorization();