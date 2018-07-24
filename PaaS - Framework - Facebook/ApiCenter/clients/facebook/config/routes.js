function RoutesFACEBOOK() {}

var FacebookController = require('../controller/facebookController');            
//var FacebookValidation = require('../validation/facebookValidation');

RoutesFACEBOOK.prototype.Internal = function(req, res, next) {
    if(req.params[0] == "login"){
        FacebookController.Login(req, res, next);
    }
    else{
        Log.Add('warning', null, null, "routes.js", "RoutesFACEBOOK.Internal", "Erro ao encontrar rota.", req.body.param.senderID, req.body.param.pageID, { request: req.body, statusCode: 404 });
        
        res.sendStatus(404);
    }

};

RoutesFACEBOOK.prototype.External = function(req, res) {
    if(req.params[0] == "sac"){ 
        FacebookController.ResponderSAC(req, res);
    }
    else{
        Log.Add('warning', null, null, "routes.js", "RoutesFACEBOOK.External", "Erro ao encontrar rota.", req.body.param.senderID, req.body.param.pageID, { request: req.body, statusCode: 404 });
        
        res.sendStatus(404);
    }

};

module.exports = new RoutesFACEBOOK();