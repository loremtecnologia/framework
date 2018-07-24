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
            url: 'https://gateway.watsonplatform.net/assistant/api/v1/workspaces/' + watson.Workspace + '/message?version=2018-02-16',
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

                firestore.setLog(pageID, null, {
                    level: "warning",
                    timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
                    url: null,
                    ip: null,
                    file: "watson.js",
                    method: "Message",
                    message: "Erro ao enviar requisição de Message para o Watson do FacebookOrchestrator.",
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
                    file: "watson.js",
                    method: "Message",
                    message: "Erro ao enviar requisição de Message para o Watson do FacebookOrchestrator.",
                    senderID: senderID,
                    recipientID: pageID,
                    meta: { request: objRequest, error: JSON.stringify(error), statusCode: response.statusCode }
                })
            }
        });
    });
}

module.exports = new Watson();