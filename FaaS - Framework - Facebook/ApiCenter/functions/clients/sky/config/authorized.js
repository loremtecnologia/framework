function Authorized() { }

Authorized.prototype.Geral = function (req, res, next) {
    if (req.headers.token == 'xGnYG6XP1fgdqlfFw') {
        next();
    } else {
        firestore.setLog(req.body.param.pageID, null, {
            level: "warning",
            timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
            url: req.originalUrl,
            ip: req.ip,
            file: "authorized.js",
            method: "Authorized.Geral",
            message: "Erro ao validar token.",
            senderID: req.body.param.senderID,
            recipientID: req.body.param.pageID,
            meta: { request: req.body, statusCode: 404 }
        })

        res.sendStatus(404);
    }
};

module.exports = new Authorized();