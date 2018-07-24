function Log() { }

Log.prototype.setLog = function (req, res) {

    let pageID
    if (!req.body.postback && req.body.message.is_echo) {
        pageID = req.body.sender.id
    }
    else {
        pageID = req.body.recipient.id
    }  

    firestore.setLog(pageID, null, {
        level: "conversation",
        timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
        url: req.originalUrl,
        ip: req.ip,
        file: "log.js",
        method: "post",
        message: "Requisicao recebida do FacebookWebhook.",
        senderID: req.body.sender.id,
        recipientID: req.body.recipient.id,
        meta: { In: req.body, NLP: res.firstNLP, Out: res.sendedToFacebook }
    })
}

module.exports = new Log();