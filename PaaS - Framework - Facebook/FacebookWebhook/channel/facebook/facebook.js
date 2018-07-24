function Facebook() { }

Facebook.prototype.receivedAuthentication = function (event) {
    console.log('receivedAuthentication')
    callSendAPI('facebook/receivedAuthentication', event).then(function (retorno) {
        console.log(retorno)
    })
}

Facebook.prototype.receivedMessage = function (event) {
    console.log('receivedMessage')
    callSendAPI('facebook/receivedMessage', event).then(function (retorno) {
        console.log(retorno)
    })
}

Facebook.prototype.receivedDeliveryConfirmation = function (event) {
    console.log('receivedDeliveryConfirmation')
    callSendAPI('facebook/receivedDeliveryConfirmation', event).then(function (retorno) {
        console.log(retorno)
    })
}

Facebook.prototype.receivedPostback = function (event) {
    console.log('receivedPostback')
    callSendAPI('facebook/receivedPostback', event).then(function (retorno) {
        console.log(retorno)
    })
}

Facebook.prototype.receivedMessageRead = function (event) {
    console.log('receivedMessageRead')
    callSendAPI('facebook/receivedMessageRead', event).then(function (retorno) {
        console.log(retorno)
    })
}

Facebook.prototype.receivedAccountLink = function (event) {
    console.log('receivedAccountLink')
    callSendAPI('facebook/receivedAccountLink', event).then(function (retorno) {
        console.log(retorno)
    })
}

function callSendAPI(endpoint, messageData) {
    return new Promise(function (resolve, reject) {
        const objRequest = {
            url: process.env.URL_FACEBOOKORCHESTRATOR + endpoint,
            method: 'POST',
            json: true,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': process.env.AUTHORIZATION_FACEBOOKORCHESTRATOR
            },
            body: messageData
        }

        request(objRequest,
            (error, response) => {
                let pageID;
                if (!messageData.postback && messageData.message.is_echo)
                    pageID = messageData.sender.id;
                else
                    pageID = messageData.recipient.id;

                if (error) {
                    Log.Add('error', null, null, "facebook.js", "callSendAPI", "Erro ao enviar reqiusicao para o FacebookOrchestrator.", messageData.sender.id, messageData.recipient.id, { request: objRequest, error: JSON.stringify(error) });

                    resolve(response.statusCode)
                }
                else if (response.statusCode != 200) {
                    Log.Add('warning', null, null, "facebook.js", "callSendAPI", "Erro ao enviar reqiusicao para o FacebookOrchestrator.", messageData.sender.id, messageData.recipient.id, { request: objRequest, response: response.body, statusCode: response.statusCode });

                    resolve(response.statusCode)
                }
                else
                    resolve(response.statusCode)
            });
    });
}

module.exports = new Facebook();