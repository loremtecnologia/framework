function Watson() { }

Watson.prototype.Message = function (watson, query, context, senderID, pageID) {

    let _body = {
        "input": {
            "text": query
        }
    }

    if (context.watsonContext) {
        var dateNow = moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
        var date = moment(context.timestamp);
        var diferenca = dateNow.diff(date, 'minutes')

        // if (diferenca > 5) {
        //     _body.contexts = context.watsonContext.contexts.map(item => item.name)
        // } else {
        //     _body.contexts = context.watsonContext.contexts
        // }
    }

    return new Promise(function (resolve, reject) {

        const objRequest = {
            url: 'https://gateway.watsonplatform.net/assistant/api/v1/workspaces/' + watson.Workspace + '/message?version=2018-07-10',
            method: 'POST',
            json: true,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            auth: {
                user: watson.username,
                pass: watson.password
            },
            body: _body
        }

        request(objRequest, (error, response) => {
            if (response.statusCode == 200) {
                resolve(response.body);
                //  console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD:")
                //  console.log(JSON.stringify(response.body))
                //  console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD:")
            }
            else {
                reject(response.body);

                Log.Add('warning', null, null, "watson.js", "Message", "Erro ao enviar requisição de Message para o Watson do FacebookOrchestrator.", senderID, pageID, { request: objRequest, statusCode: response.statusCode });                
            }
            if (error) {
                reject(error);

                Log.Add('error', null, null, "watson.js", "Message", "Erro ao enviar requisição de Message para o Watson do FacebookOrchestrator.", senderID, pageID, { request: objRequest, error: JSON.stringify(error), statusCode: response.statusCode });
            }
        });
    });
}

Watson.prototype.sendTypingOn = function (token, recipientId, pageID) {
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

Watson.prototype.sendTextMessage = function (token, recipientId, messageText, pageID) {
    return new Promise(function (resolve, reject) {
        var messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text: messageText.text
            }
        };
        Facebook.callSendAPI(token, messageData, resolve, reject, pageID)
            .then(function (retorno) {
                resolve()
            })
    })
}

Watson.prototype.sendCustomMessage = function (token, recipientId, template, pageID) {
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

module.exports = new Watson();