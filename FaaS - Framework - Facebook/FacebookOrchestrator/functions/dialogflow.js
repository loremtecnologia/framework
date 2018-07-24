function Dialogflow() { }

Dialogflow.prototype.detectIntent = function (dialogflow, message, context, senderID, pageID) {
    return new Promise(function (resolve, reject) {

        generateAccessToken(dialogflow)
            .then(function (retorno) {
                let contexts = {};

                if (context) {
                    var dateNow = moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
                    var date = moment(context.timestamp);
                    var diferenca = dateNow.diff(date, 'minutes')

                    if (diferenca > 5) {
                        contexts = context.contexts.map(item => item.name)
                    } else {
                        contexts = context.contexts
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

                        firestore.setLog(pageID, null, {
                            level: "warning",
                            timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
                            url: null,
                            ip: null,
                            file: "dialogflow.js",
                            method: "Query",
                            message: "Erro ao enviar requisição de Query para o Dialogflow do FacebookOrchestrator.",
                            senderID: senderID,
                            recipientID: pageID,
                            meta: { request: objRequest, statusCode: response.statusCode }
                        })

                    }
                    if (error) {
                        reject(error);

                        firestore.setLog(pageID, null, {
                            level: "error",
                            timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
                            url: null,
                            ip: null,
                            file: "dialogflow.js",
                            method: "Query",
                            message: "Erro ao enviar requisicao de Query para o Dialogflow do FacebookOrchestrator.",
                            senderID: senderID,
                            recipientID: pageID,
                            meta: { request: objRequest, error: JSON.stringify(error), statusCode: response.statusCode }
                        })
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

                firestore.setLog(pageID, null, {
                    level: "warning",
                    timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
                    url: null,
                    ip: null,
                    file: "dialogflow.js",
                    method: "Event",
                    message: "Erro ao enviar requisicao de Event para o Dialogflow do FacebookOrchestrator.",
                    senderID: senderID,
                    recipientID: pageID,
                    meta: { request: objRequest, statusCode: response.statusCode }
                })
            }
            if (error) {
                reject(error);

                firestore.setLog(pageID, null, {
                    level: "error",
                    timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
                    url: null,
                    ip: null,
                    file: "dialogflow.js",
                    method: "Event",
                    message: "Erro ao enviar requisicao de Event para o Dialogflow do FacebookOrchestrator.",
                    senderID: senderID,
                    recipientID: pageID,
                    meta: { request: objRequest, error: JSON.stringify(error), statusCode: response.statusCode }
                })
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

module.exports = new Dialogflow();