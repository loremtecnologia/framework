function FacebookController() { }

FacebookController.prototype.Login = function (req, res, next) {
    const objRequest = {
        url: 'https://graph.facebook.com/v2.6/' + req.body.param.senderID + '?access_token=' + req.body.param.page_access_token + '',
        method: 'GET'
    };

    request(objRequest, function (err, response){
        
        const retorno = JSON.parse(response.body)

        if (response.statusCode == 200)
            retorno.valido = true;
        else{
            retorno.valido = false;

            firestore.setLog(req.body.param.pageID, null, {
                level: "warning",
                timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
                url: req.originalUrl,
                ip: req.ip,
                file: "facebookController.js",
                method: "Login",
                message: "Erro ao enviar request para o facebook.",
                senderID: req.body.param.senderID,
                recipientID: req.body.param.pageID,
                meta: { request: objRequest, retorno: retorno, statusCode: response.statusCode }
            })

        }
        if (err) {

            firestore.setLog(req.body.param.pageID, null, {
                level: "error",
                timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
                url: req.originalUrl,
                ip: req.ip,
                file: "facebookController.js",
                method: "Login",
                message: "Erro ao enviar request para o facebook.",
                senderID: req.body.param.senderID,
                recipientID: req.body.param.pageID,
                meta: { request: objRequest, statusCode: 401, error: JSON.stringify(err) }
            })

        }
        res.objRequest = objRequest
        res.retorno = retorno
        next()
        res.json(retorno)
    });
};

module.exports = new FacebookController();