function RoutesSKY() { }

var SkyController = require('../controller/skyController');
//var SkyValidation = require('../validation/skyValidation');

RoutesSKY.prototype.Internal = function (req, res, next) {
    if (req.params[0] == "carrossel") {
        SkyController.Carrossel(req, res, next);
    }
    else if (req.params[0] == "skuprepago") {
        SkyController.SkuPrePago(req, res, next);
    }
    else {
        firestore.setLog(req.body.param.pageID, null, {
            level: "warning",
            timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
            url: req.originalUrl,
            ip: req.ip,
            file: "routes.js",
            method: "RoutesSKY.Internal",
            message: "Erro ao encontrar rota.",
            senderID: req.body.param.senderID,
            recipientID: req.body.param.pageID,
            meta: { request: req.body, statusCode: 404 }
        })

        res.sendStatus(404);
    }
};

RoutesSKY.prototype.External = function (req, res, next) {
    if (req.params[0] == "sku") {
        SkyController.GetProductSkus(req, res, next);
    }
    else if (req.params[0] == "skucatalog") {
        SkyController.SkuCatalog(req, res, next);
    }
    else {
        firestore.setLog(req.body.param.pageID, null, {
            level: "warning",
            timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
            url: req.originalUrl,
            ip: req.ip,
            file: "routes.js",
            method: "RoutesSKY.External",
            message: "Erro ao encontrar rota.",
            senderID: req.body.param.senderID,
            recipientID: req.body.param.pageID,
            meta: { request: req.body, statusCode: 404 }
        })

        res.sendStatus(404);
    }

};

module.exports = new RoutesSKY();