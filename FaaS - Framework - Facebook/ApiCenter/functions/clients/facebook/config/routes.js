function RoutesFACEBOOK() {}

var FacebookController = require('../controller/facebookController');            
//var FacebookValidation = require('../validation/facebookValidation');

RoutesFACEBOOK.prototype.Internal = function(req, res, next) {
    if(req.params[0] == "login"){
        FacebookController.Login(req, res, next);
    }
    else{
        
        firestore.setLog(req.body.param.pageID, null, {
            level: "warning",
            timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
            url: req.originalUrl,
            ip: req.ip,
            file: "routes.js",
            method: "RoutesFACEBOOK.Internal",
            message: "Erro ao encontrar rota.",
            senderID: req.body.param.senderID,
            recipientID: req.body.param.pageID,
            meta: { request: req.body, statusCode: 404 }
        })
        
        res.sendStatus(404);
    }

};

RoutesFACEBOOK.prototype.External = function(req, res) {
    if(req.params[0] == "sac"){ 
        FacebookController.ResponderSAC(req, res);
    }
    else{
        
        firestore.setLog(req.body.param.pageID, null, {
            level: "warning",
            timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
            url: req.originalUrl,
            ip: req.ip,
            file: "routes.js",
            method: "RoutesFACEBOOK.External",
            message: "Erro ao encontrar rota.",
            senderID: req.body.param.senderID,
            recipientID: req.body.param.pageID,
            meta: { request: req.body, statusCode: 404 }
        })
        
        res.sendStatus(404);
    }

};

module.exports = new RoutesFACEBOOK();