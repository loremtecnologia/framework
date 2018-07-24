function Log() { }

Log.prototype.setLog = function (req, res) {
    
    meta = { 
        In : {
            headers : req.headers,
            body : req.body        
        },       
        Out : {
            request : res.objRequest,
            response : res.retorno
        }
    }

    firestore.setLog(req.body.param.pageID, null, {
        level: "info",
        timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
        url: req.originalUrl,
        ip: req.ip,
        file: "log.js",
        method: "post",
        message: "Requisicao recebida do FacebookOrchestrator.",
        senderID: req.body.param.senderID,
        recipientID: req.body.param.pageID,
        meta: meta
    })
}

module.exports = new Log();