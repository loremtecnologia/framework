function RoutesUNIP() {}

var UnipController = require('../controller/unipController');            
//var FacebookValidation = require('../validation/facebookValidation');

RoutesUNIP.prototype.Internal = function(req, res, next) {
    if(req.params[0] == "unidade"){
        UnipController.UnidadeProxima(req, res, next);
    }
    else if(req.params[0] == "pendencias"){
        UnipController.PendenciasCarrossel(req, res, next);
    }
    else if(req.params[0] == "faltas"){
        UnipController.FaltasLista(req, res, next);
    }
    else if(req.params[0] == "notas"){
        UnipController.NotasLista(req, res, next);
    }
    else if(req.params[0] == "atendente"){
        UnipController.VerificarAtendente(req, res, next);
    }
    else{
        
        firestore.setLog(req.body.param.pageID, null, {
            level: "warning",
            timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
            url: req.originalUrl,
            ip: req.ip,
            file: "routes.js",
            method: "RoutesUNIP.Internal",
            message: "Erro ao encontrar rota.",
            senderID: req.body.param.senderID,
            recipientID: req.body.param.pageID,
            meta: { request: req.body, statusCode: 404 }
        })
        
        res.sendStatus(404);
    }

};

module.exports = new RoutesUNIP();