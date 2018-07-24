const Dialogflow = require('./dialogflow.js');
const Watson = require('./watson.js');

function receivedMessage() { }

receivedMessage.prototype.messageToNLP = function (req, res, next) {
    var event = req.body;
    var senderID = event.sender.id;

    res.senderID = senderID;

    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    var isEcho = message.is_echo;
    var messageId = message.mid;
    var appId = message.app_id;
    var metadata = message.metadata;

    // You may get a text or attachment but not both
    var messageText = message.text;
    var messageAttachments = message.attachments;
    var quickReply = message.quick_reply;

    if (isEcho) {
        // Just logging message echoes to console
        console.log("Received echo for message %s and app %d with metadata %s",
            messageId, appId, metadata);
        res.json();
        return;
    } else if (quickReply) {
        var quickReplyPayload = quickReply.payload;
        messageText = quickReplyPayload;
    }

    if (messageAttachments) {
        //   console.log('messageAttachments');
        if (messageAttachments[0].type == 'image') {
        }
    }

    let listMessages;

    if (res.CLIENT.Platform == "Dialogflow") {
        Dialogflow.detectIntent(res.CLIENT.Dialogflow, messageText, res.User, senderID, recipientID)
            .then(function (retorno) {
                res.firstNLP = JSON.parse(JSON.stringify(retorno));
                listMessages = retorno.queryResult.fulfillmentMessages.filter(e => e.platform == "FACEBOOK");
                if (retorno.queryResult.action && retorno.queryResult.action.length > 0) {
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
                if (res.firstNLP.queryResult.action && res.firstNLP.queryResult.action.length > 0) {
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
                //console.log(JSON.stringify(retorno))
                //console.log('fim receivedMessageToNLP')
                next();
            })
    }
    else if (res.CLIENT.Platform == "Watson") {
        Watson.Message(res.CLIENT.Watson, messageText, res.User, senderID, recipientID)
            .then(function (retorno) {
                res.firstNLP = JSON.parse(JSON.stringify(retorno));
                listMessages = retorno.output.messages;
                res.Messages = listMessages;
                    return;
            })
            .then(function (retorno) {
                // console.log('fim receivedMessageToNLP')
                next();
            })

    }


}

function events(action, dialogflow, senderID, messages, pageID) {
    console.log('entrou jump')
    console.log(action)
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
                })

        })
        .then(function (retorno) {
            //console.log('fim recursivo jump')
            action.shift();
            //console.log(action)
            //console.log('*****')
            //console.log(_action)
            if (itemNLP.queryResult.action && itemNLP.queryResult.action.length > 0) {
                let _action = itemNLP.queryResult.action.split('#');
                _action = _action.filter(x => x.indexOf('EVENTS') > -1);
                //console.log(_action)
                action.unshift(_action[0])
            }
            //console.log('--------------')
            //console.log(action.length)
            //console.log(action[0])
            if (action[0] != undefined && action.length > 0) {
                return (events(action, dialogflow, senderID, messages, pageID)); // RECURSE!
            }
            else
                return messages;
        })
    return (_list);
}

module.exports = new receivedMessage();