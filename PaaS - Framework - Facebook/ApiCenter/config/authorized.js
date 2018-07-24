function Authorized() { }

Authorized.prototype.Internal = function (req, res, next) {
    if (req.headers.authorization == process.env.AUTHORIZATION_APICENTER) {
        next();
    } else {
        //Log.Add('info', req.originalUrl, 'Authorized.Internal', 'Autenticação interna não permitida.', req.ip, { obj: req.headers }, false);
        res.sendStatus(404);
    }
};

Authorized.prototype.External = function (req, res, next) {
    // if (req.params[0] == "sky") {
    //     AuthorizedVISA.Login(req, res, next);
    // }
    // else if (req.params[0] == "calendar") {
    //     AuthorizedGOOGLE.AuthCalendar(req, res, next);
    // }
    // else if (req.params[0] == "spreadsheets") {
    //     AuthorizedGOOGLE.AuthSheets(req, res, next);
    // }
    // else if (req.params[0] == "cloudplatform") {
    //     AuthorizedGOOGLE.AuthCloudPlatform(req, res, next);
    // }
    // else {
        
    //     firestore.setLog(req.body.param.pageID, null, {
    //         level: "warning",
    //         timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
    //         url: req.originalUrl,
    //         ip: req.ip,
    //         file: "authorized.js",
    //         method: "Authorized.External",
    //         message: "Erro ao encontrar rota.",
    //         senderID: req.body.param.senderID,
    //         recipientID: req.body.param.pageID,
    //         meta: { request: req.body, statusCode: 404 }
    //     })

    //     res.sendStatus(404);
    // }
};

Authorized.prototype.JWTEncrypt = function (req, res, next) {
    res.body.token = Cryptography.Encrypt(res.body.token);
    res.json(res.body);
};

Authorized.prototype.JWTDecrypt = function (req, res, next) {
    req.headers.token = Cryptography.Decrypt(req.headers.token);
    next();
};



module.exports = new Authorized();