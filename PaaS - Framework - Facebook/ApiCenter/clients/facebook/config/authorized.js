function Authorized() {}

visaTokenValidation = "";
visaTokenValidationHML = "";

Authorized.prototype.Geral = function(req, res, next) {
    if (req.headers.token == 'YXP6qxGnlfF1fgdGw'){
        next();
    } else {
        res.sendStatus(404);
    }
};

Authorized.prototype.Login = function(req, res, next) {
    var retorno = {};
    if (req.headers.usuario == "visachatbot9qkqj1t6@hyperativa.com.br" && req.headers.senha == "b-#V\"shMK{t~kXv1YyyA?\\@e]DF\"%|I{/UbOLDl9"){
        var expires = moment().add(1, 'day').valueOf();
        var token = jwt.encode({
            user: req.headers.usuario,
            exp: expires
        }, "jTXZWop2E8J0b5qA");

        retorno.token = token;
        retorno.valido = true;
        res.sendStatus = 200;
        res.body = retorno;
        next();
    } else {
        Log.Add('info', req.originalUrl, 'VISA.Authorized.Login', 'Autenticação externa não permitida.', req.ip, { obj: req.headers }, false);
        res.sendStatus(401);
    }
};

Authorized.prototype.Validation = function(req, res, next) {
    try {
        var decoded = jwt.decode(req.headers.token, "jTXZWop2E8J0b5qA");
        var isExpired = moment(decoded.exp).isBefore(new Date());
        if(isExpired){
            Log.Add('info', req.originalUrl, 'VISA.Authorized.Validation', 'Validação externa não permitida.', req.ip, { obj: req.headers }, false);
            res.sendStatus(401);
        }
        else{
            next();
        }
    } catch(err){
        Log.Add('error', req.originalUrl, 'VISA.Authorized.Validation', 'Erro ao fazer validação do token.', req.ip, { obj: err }, false);
        res.sendStatus(401);
    }
};

Authorized.prototype.Authenticate = function(req, res, next) {
    try {
        var login = {
            "Email": "chatbot@hyperativa.com.br",
            "Senha": "#YaCuYHRIv0h1TJzQ#K#gVb50C60$*&qrsOoh$X@",
            "IP": "http://cia.smarte.rs"
        };

        var options = {  
            url: 'https://www.visaform.com.br/api/loginsys/autenticar/login',
            method: "POST",              
            headers: {
                "content-type": "application/json",
            },
            body: login,
            json: true
        };
        request(options, function(err, response, body) {
            if(body.logado == true){
                visaTokenValidation = body.token;
                
                next(req, res, next);
            }
            else{
                Log.Add('info', req.originalUrl, 'VISA.Authorized.Authenticate', 'Autenticação externa não permitida.', req.ip, { obj: body }, false);
                res.sendStatus(401);
            }
        });
    } catch(err){
            Log.Add('error', req.originalUrl, 'VISA.Authorized.Authenticate', 'Erro ao fazer autenticação no https://www.visaform.com.br/api/loginsys/autenticar/login.', req.ip, { obj: err }, false);
            res.sendStatus(401);
        }
};

Authorized.prototype.AuthenticateHML = function(req, res, next) {
    try {
        var login = {
            "Email": "chatbot@hyperativa.com.br",
            "Senha": "HMd5WbxTQYWLLh6",
            "IP": "http://cia.smarte.rs"
        };

        var options = {  
            url: 'https://www.visaform.com.br/____uat____/api/loginsys/autenticar/login',
            method: "POST",              
            headers: {
                "content-type": "application/json",
            },
            body: login,
            json: true
        };
        request(options, function(err, response, body) {
            if(body.logado == true){
                visaTokenValidationHML = body.token;
                
                next(req, res, next);
            }
            else{
                Log.Add('info', req.originalUrl, 'VISA.Authorized.Authenticate', 'Autenticação externa não permitida.', req.ip, { obj: body }, false);
                res.sendStatus(401);
            }
        });
    } catch(err){
            Log.Add('error', req.originalUrl, 'VISA.Authorized.Authenticate', 'Erro ao fazer autenticação no https://www.visaform.com.br/api/loginsys/autenticar/login.', req.ip, { obj: err }, false);
            res.sendStatus(401);
        }
};


module.exports = new Authorized();