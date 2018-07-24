var UserModel = require('../db/models/user');

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

    UserModel.findOne(
        { pageID: pageID, userID: userID }, // find a document with that filter
        function (err, doc) { // callback
            if (err) {
                console.log(err)
            } else {
                if (doc) {
                    res.User = doc;
                    next();
                } else {
                    let newUser = UserModel({
                        pageID: pageID,
                        userID: userID,
                        timestamp: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
                    });

                    newUser.save(function (err, newLog) {
                        res.User = newLog;
                        next();
                    });
                }
            }
        }
    );
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

            let newContext = UserModel({
                _id: res.User._id,
                dialogflowContext: context
            });
            UserModel.findByIdAndUpdate(
                res.User._id,
                newContext,
                { new: true },
                function (err, doc) { // callback
                    if (err) {
                        console.log(err)
                    } else {
                    }
                }
            )
        }
    }
    else if (res.CLIENT.Platform == "Watson") {
    }
}

module.exports = new User();