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

            Log.Add('warning', null, null, "facebookController.js", "Login", "Erro ao enviar request para o facebook.", req.body.param.senderID, req.body.param.pageID, { request: objRequest, retorno: retorno, statusCode: response.statusCode });
        }
        if (err) {
            Log.Add('error', null, null, "facebookController.js", "Login", "Erro ao enviar request para o facebook.", req.body.param.senderID, req.body.param.pageID, { request: objRequest, statusCode: 401, error: JSON.stringify(err) });
        }
        res.objRequest = objRequest
        res.retorno = retorno
        next()
        res.json(retorno)
    });
};

module.exports = new FacebookController();