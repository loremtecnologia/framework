const Dialogflow = require('../../nlp/dialogflow');

function receivedPostback() { }

receivedPostback.prototype.messageToNLP = function (req, res, next) {
    var event = req.body;
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfPostback = event.timestamp;

    res.senderID = senderID;

    // The 'payload' param is a developer-defined field which is set in a postback 
    // button for Structured Messages. 
    var messageText = event.postback.payload;

    if (messageText == "FACEBOOK_WELCOME") {
        if (res.CLIENT.Platform == "Dialogflow") {
            Dialogflow.Event(res.CLIENT.Dialogflow, messageText, senderID, recipientID)
                .then(function (retorno) {
                    res.firstNLP = JSON.parse(JSON.stringify(retorno));
                    //remove as messagens vazias que vem do dialog
                    let listMessages = retorno.queryResult.fulfillmentMessages.filter(e => e.platform == "FACEBOOK");
                    if (retorno.queryResult.action.length > 0) {
                        let action = retorno.queryResult.action.split('#');
                        let promiseArr = action.map(function (element) {
                            if (element.indexOf('FORMART') > -1) {
                                //TODO: evento FORMAT
                                //console.log('FORMAT')
                                // var _listMessages = Jump(action, element, res.CLIENT_ACCESS_TOKEN, senderID);
                                // console.log('aqui 001')
                                // return (_listMessages);
                            }
                            else if (element.indexOf('SEND') > -1) {
                                //TODO: evento SEND
                                //console.log('SEND')
                            }
                            else {
                                //TODO: evento OUTROS
                                //console.log('outros')
                            }
                        });

                        Promise.all(promiseArr).then(function (resultsArray) {
                            // do something after the loop finishes
                            //console.log('acabou actions');
                            res.Messages = listMessages;
                            return;
                        }).catch(function (err) {
                            console.log('recivedMessage.js - Query - erro actions : ', JSON.stringify(err))
                            // do something when any of the promises in array are rejected
                        })
                    } else {
                        res.Messages = listMessages;
                        return;
                    }
                })
                .then(function (retorno) {
                    //console.log(res.Messages)
                    if (res.firstNLP.queryResult.action.length > 0) {
                        let action = res.firstNLP.queryResult.action.split('#');
                        action = action.filter(x => x.indexOf('EVENTS') > -1);
                        if (action.length > 0) {
                            var _listMessages = events(action, res.CLIENT.Dialogflow, senderID, res.Messages, recipientID);
                            return (_listMessages);
                        }
                        else
                            return;
                    }
                    else {
                        return;
                    }
                })
                .then(function (retorno) {
                    // console.log('fim receivedMessageToNLP')
                    next();
                })
        }
        else if (res.CLIENT.Platform == "Watson") {

        }

    }
    else {
        if (res.CLIENT.Platform == "Dialogflow") {
            Dialogflow.detectIntent(res.CLIENT.Dialogflow, messageText, res.User, senderID, recipientID)
                .then(function (retorno) {
                    res.firstNLP = JSON.parse(JSON.stringify(retorno));
                    //remove as messagens vazias que vem do dialog
                    let listMessages = retorno.queryResult.fulfillmentMessages.filter(e => e.platform == "FACEBOOK");
                    if (retorno.queryResult.action.length > 0) {
                        let action = retorno.queryResult.action.split('#');
                        let promiseArr = action.map(function (element) {
                            if (element.indexOf('FORMART') > -1) {
                                //TODO: evento FORMAT
                                //console.log('FORMAT')
                                // var _listMessages = Jump(action, element, res.Facebook.CLIENT_ACCESS_TOKEN, senderID);
                                // console.log('aqui 001')
                                // return (_listMessages);
                            }
                            else if (element.indexOf('SEND') > -1) {
                                //TODO: evento SEND
                                //console.log('SEND')
                            }
                            else {
                                //TODO: evento OUTROS
                                //console.log('outros')
                            }
                        });

                        Promise.all(promiseArr).then(function (resultsArray) {
                            // do something after the loop finishes
                            //console.log('acabou actions');
                            res.Messages = listMessages;
                            return;
                        }).catch(function (err) {
                            console.log('recivedMessage.js - Query - erro actions : ', JSON.stringify(err))
                            // do something when any of the promises in array are rejected
                        })
                    } else {
                        res.Messages = listMessages;
                        return;
                    }
                })
                .then(function (retorno) {
                    //console.log(res.Messages)
                    if (res.firstNLP.queryResult.action.length > 0) {
                        let action = res.firstNLP.queryResult.action.split('#');
                        action = action.filter(x => x.indexOf('EVENTS') > -1);
                        if (action.length > 0) {
                            var _listMessages = events(action, res.CLIENT.Dialogflow, senderID, res.Messages, recipientID);
                            return (_listMessages);
                        }
                        else
                            return;
                    }
                    else {
                        return;
                    }
                })
                .then(function (retorno) {
                    // console.log('fim receivedMessageToNLP')
                    next();
                })
        }
        else if (res.CLIENT.Platform == "Watson") {

        }
    }
}

function events(action, dialogflow, senderID, messages, pageID) {
    //console.log('entrou jump')
    let event = action[0].replace('EVENTS.', '');
    let itemNLP;

    const _list = Promise.resolve()
        .then(function () {
            return Dialogflow.Event(dialogflow, event, senderID, pageID)
                .then(function (retorno) {
                    itemNLP = retorno;
                    retorno.queryResult.fulfillmentMessages.forEach(element => {
                        messages.push(element)
                        //console.log(element)
                    });
                    //console.log('retorno jump')
                    //console.log(listMessages)
                })

        })
        .then(function (retorno) {
            //console.log('fim recursivo jump')
            //console.log(itemNLP)
            action.shift();

            let _action = itemNLP.queryResult.action.split('#');
            if (itemNLP.queryResult.action.length > 0) {
                _action = _action.filter(x => x.indexOf('EVENTS') > -1);
                action.unshift(_action[0])
            }

            if (action.length > 0) {
                return (events(action, dialogflow, senderID, messages, pageID)); // RECURSE!
            }
            else
                return messages;
        })
    return (_list);
}

module.exports = new receivedPostback();