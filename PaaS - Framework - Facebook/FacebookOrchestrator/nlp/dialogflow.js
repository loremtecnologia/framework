function Dialogflow() { }

Dialogflow.prototype.detectIntent = function (dialogflow, message, user, senderID, pageID) {
    return new Promise(function (resolve, reject) {

        generateAccessToken(dialogflow)
            .then(function (retorno) {
                let contexts = {};

                if (user.dialogflowContext) {
                    var dateNow = moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
                    var date = moment(user.dialogflowContext.timestamp);
                    var diferenca = dateNow.diff(date, 'minutes')

                    if (diferenca > 5) {
                        contexts = user.dialogflowContext.contexts.map(item => item.name)
                    } else {
                        contexts = user.dialogflowContext.contexts
                    }
                }

                let _body = {
                    "queryInput":
                    {
                        "text": {
                            "text": message,
                            "languageCode": "pt-BR"
                        }
                    },
                    "queryParams":
                    {
                        "contexts": []
                    }
                }
                const objRequest = {
                    url: 'https://dialogflow.googleapis.com/v2/projects/' + dialogflow.ProjectID + '/agent/sessions/' + senderID + ':detectIntent',
                    method: 'POST',
                    json: true,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Authorization': 'Bearer ' + retorno
                    },
                    body: _body
                }

                request(objRequest, (error, response) => {
                    if (response.statusCode == 200) {
                        resolve(response.body);
                        // console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD:")
                        // console.log(JSON.stringify(response.body))
                        // console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD:")
                    }
                    else {
                        reject(response.body);

                        Log.Add('warning', null, null, "dialogflow.js", "Query", "Erro ao enviar requisição de Query para o Dialogflow do FacebookOrchestrator.", senderID, pageID, { request: objRequest, statusCode: response.statusCode });

                    }
                    if (error) {
                        reject(error);

                        Log.Add('error', null, null, "dialogflow.js", "Query", "Erro ao enviar requisicao de Query para o Dialogflow do FacebookOrchestrator.", senderID, pageID, { request: objRequest, error: JSON.stringify(error), statusCode: response.statusCode });
                    }
                });
            })
    });
}

Dialogflow.prototype.Event = function (dialogflow, event, senderID, pageID) {
    let _body = {
        "queryInput":
        {
            "event": {
                "name": event,
                "languageCode": "pt-BR"
            }
        }
    }

    return new Promise(function (resolve, reject) {
        request({
            url: 'https://dialogflow.googleapis.com/v2/projects/' + dialogflow.ProjectID + '/agent/sessions/' + senderID + ':detectIntent',
            method: 'POST',
            json: true,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Bearer ' + dialogflow.printaccesstoken
            },
            body: _body
        }, (error, response) => {
            if (response.statusCode == 200) {
                //console.log('retorno nlp ' + response.statusCode)
                resolve(response.body);
            }
            else {
                reject(response.body);

                Log.Add('warning', null, null, "dialogflow.js", "Event", "Erro ao enviar requisicao de Event para o Dialogflow do FacebookOrchestrator.", senderID, pageID, { request: objRequest, statusCode: response.statusCode });
            }
            if (error) {
                reject(error);

                Log.Add('error', null, null, "dialogflow.js", "Event", "Erro ao enviar requisicao de Event para o Dialogflow do FacebookOrchestrator.", senderID, pageID, { request: objRequest, error: JSON.stringify(error), statusCode: response.statusCode });
            }
        });
    });
}

Dialogflow.prototype.Format = function (listMessage) {
    return new Promise(function (resolve, reject) {
        var count = listMessage.length;

        var _list = [];

        var _card = {
            platform: "FACEBOOK",
            elements: []
        };
        //colocar todos os cards na mesma mensagem
        listMessage.forEach(function (element, index) {
            if (!element.card) {
                if (_card.elements.length > 0) {
                    _list.push(_card);
                    _card = {
                        platform: "FACEBOOK",
                        elements: []
                    };
                }
                _list.push(element);
            }
            else if (element.card) {
                var _buttons = [];

                element.card.buttons.forEach(function (bt) {
                    //TODO: verificar se button esta vazio
                    if (bt.postback.indexOf('http') > -1) {
                        var _bt = {
                            title: bt.text,
                            type: "web_url",
                            url: bt.postback
                        }
                    }
                    else {
                        var _bt = {
                            title: bt.text,
                            type: "postback",
                            payload: bt.postback
                        }
                    }
                    _buttons.push(_bt);
                });

                var _elem = {
                    title: element.card.title,
                    subtitle: element.card.subtitle,
                    image_url: element.card.imageUri,
                    buttons: _buttons
                }

                _card.elements.push(_elem);

                if ((index + 1) == count) {
                    _list.push(_card);
                    _card = {
                        platform: "FACEBOOK",
                        elements: []
                    };
                }
            }

            resolve(_list);
        });
    });
}

function generateAccessToken(dialogflow) {
    return new Promise(function (resolve, reject) {
        tokens.get({
            email: dialogflow.GoogleAuth.client_email,
            key: dialogflow.GoogleAuth.private_key,
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        },
            (err, token) => {
                if (!err) {
                    resolve(token)
                }
                else {
                    reject(err)
                }
            }
        );
    });
}

Dialogflow.prototype.sendTypingOn = function (token, recipientId, pageID) {
    return new Promise(function (resolve, reject) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            sender_action: "typing_on"
        };
        Facebook.callSendAPI(token, messageData, resolve, reject, pageID)
            .then(function (retorno) {
                resolve()
            })
    })
}

Dialogflow.prototype.sendTextMessage = function (token, recipientId, messageText, pageID) {
    return new Promise(function (resolve, reject) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text: messageText.text[0]
            }
        };
        Facebook.callSendAPI(token, messageData, resolve, reject, pageID)
            .then(function (retorno) {
                resolve()
            })
    })
}

Dialogflow.prototype.sendImageMessage = function (token, recipientId, imageUrl, pageID) {
    return new Promise(function (resolve, reject) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "image",
                    payload: {
                        url: imageUrl
                    }
                }
            }
        };
        Facebook.callSendAPI(token, messageData, resolve, reject, pageID)
            .then(function (retorno) {
                resolve()
            })
    })
}

Dialogflow.prototype.sendQuickReply = function (token, recipientId, title, replies, pageID) {
    return new Promise(function (resolve, reject) {
        var _replies = [];
        replies.forEach(function (rep) {
            var _rep = {
                "content_type": "text",
                "title": rep,
                "payload": rep
            }
            _replies.push(_rep);
        });

        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text: title,
                quick_replies: _replies
            }
        };
        Facebook.callSendAPI(token, messageData, resolve, reject, pageID)
            .then(function (retorno) {
                resolve()
            })
    })
}

Dialogflow.prototype.sendCardMessage = function (token, recipientId, cards, pageID) {
    return new Promise(function (resolve, reject) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: cards
                    }
                }
            }
        };
        Facebook.callSendAPI(token, messageData, resolve, reject, pageID)
            .then(function (retorno) {
                resolve()
            })
    })
}

Dialogflow.prototype.sendCustomMessage = function (token, recipientId, template, pageID) {
    return new Promise(function (resolve, reject) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: template
        };
        Facebook.callSendAPI(token, messageData, resolve, reject, pageID)
            .then(function (retorno) {
                resolve()
            })
    })
}

module.exports = new Dialogflow();