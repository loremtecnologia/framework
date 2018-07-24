function User() { }

User.prototype.GetContext = function (req, res, next) {

    let pageID, userID;
    if (!req.body.postback && req.body.message.is_echo) {
        pageID = req.body.sender.id
        userID = req.body.recipient.id
    }
    else {
        pageID = req.body.recipient.id
        userID = req.body.sender.id
    }

    realtimeDatabase.getContext(pageID, userID).then(function (retorno) {
        res.User = retorno;
        next();
    })
}

User.prototype.SendContext = function (req, res, next) {
    next();

    let pageID, userID;
    if (!req.body.postback && req.body.message.is_echo) {
        pageID = req.body.sender.id
        userID = req.body.recipient.id
    }
    else {
        pageID = req.body.recipient.id
        userID = req.body.sender.id
    }

    if (res.CLIENT.Platform == "Dialogflow") {
        if (res.firstNLP.queryResult.outputContexts) {

            let contextsDialogflow = [];

            res.firstNLP.queryResult.outputContexts.forEach(element => {
                _context = {};
                _context.name = element.name;
                _context.lifespanCount = element.lifespanCount;
                contextsDialogflow.push(_context);
            });

            let context = null;
            if (contextsDialogflow.length > 0) {
                context = {
                    contexts: contextsDialogflow,
                    timestamp: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
                }
            }

            realtimeDatabase.setContext(pageID, userID, context)
        }
    }
    else if (res.CLIENT.Platform == "Watson") {
    }
}

module.exports = new User();