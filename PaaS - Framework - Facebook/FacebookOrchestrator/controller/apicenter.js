function APICenter() { }

APICenter.prototype.externalAPI = function(messages, token, senderID, pageID) {
    //console.log('externalAPI')
    // console.log('---------')
    // console.log(messages)
    // console.log('---------')
    return new Promise(function (resolve, reject) {
        callExternalAPI(messages, token, senderID, pageID)
            .then(function (retorno) {
                //console.log(retorno)
                return percorrer(messages, retorno, 0)
                //console.log(teste.attachment.payload)
                function percorrer(obj, retornoAPI, count) {
                    for (var propriedade in obj) {
                        //console.log(propriedade)
                        if (obj.hasOwnProperty(propriedade)) {
                            if (typeof obj[propriedade] == "object") {
                                if (Array.isArray(obj[propriedade])) {
                                    // console.log(propriedade)
                                    // console.log('propriedade %%%%%%%%%%%%%%%%%%%')
                                    retornoAPI = retornoAPI[propriedade];
                                    if (retornoAPI != undefined) {
                                        // console.log('RRRRRRRRRRRRRRR')
                                        // console.log(retornoAPI)
                                        // console.log('RRRRRRRRRRRRRRR')
                                        var diferenca = retornoAPI.length - obj[propriedade].length;
                                        //console.log(diferenca)
                                        //console.log('diferenca')
                                        for (let index = 0; index < diferenca; index++) {
                                            //console.log('add linha')
                                            obj[propriedade].push(JSON.parse(JSON.stringify(obj[propriedade][0])));
                                        }
                                        obj[propriedade].forEach(function (item, index) {
                                            for (key2 in item) {
                                                if (typeof item[key2] == "object") {
                                                    //console.log('OBJECT ******************')
                                                    if (Array.isArray(item[key2])) {
                                                        let _Obj = {
                                                            [key2]: item[key2]
                                                        }
                                                        percorrer(_Obj, retornoAPI[index], count++);
                                                    }
                                                    else {
                                                        percorrer(_Obj, retornoAPI, count++);
                                                    }

                                                }
                                                else {
                                                    //console.log('NAO É OBJECT ********')
                                                    //console.log(item[key2])
                                                    if (item[key2].toString().indexOf('<%=') > -1) {
                                                        //console.log(propriedade)
                                                        //console.log(item[key2])
                                                        let variable = item[key2].substring(item[key2].lastIndexOf("<%=") + 3, item[key2].lastIndexOf("%>")).trim();
                                                        //  console.log('variable',variable)
                                                        //  console.log(index)
                                                        //  console.log(retornoAPI)
                                                        //  console.log('api', retornoAPI[index][variable])
                                                        item[key2] = JSON.parse(JSON.stringify(ejs.render(item[key2], { [variable]: retornoAPI[index][variable] })));
                                                        //item[key2] = JSON.parse(JSON.stringify(ejs.render([item[key2]], { [key2]: retornoAPI[index][key2] })));
                                                        // console.log('TTTTTTTTTTTTTTTTTTTTTTTT')
                                                        // console.log(obj[propriedade][index])
                                                        // console.log('TTTTTTTTTTTTTTTTTTTTTTTT')
                                                    }
                                                }
                                            }
                                        });
                                    }
                                } else {
                                    percorrer(obj[propriedade], retornoAPI, count++);
                                }
                            } else {
                                if (obj[propriedade].toString().indexOf('<%=') > -1) {
                                    //console.log(obj[propriedade])
                                    let variable = obj[propriedade].substring(obj[propriedade].lastIndexOf("<%=") + 3, obj[propriedade].lastIndexOf("%>")).trim();
                                    //console.log(variable)
                                    obj[propriedade] = ejs.render(obj[propriedade], { [variable]: retorno[variable] });
                                    //obj[propriedade] = ejs.render(obj[propriedade], { [propriedade]: retorno[propriedade] });
                                }
                            }
                        }
                    }
                    return obj;
                }
            }, function (erro) {
                //console.log('-----------------')
                console.log(erro)
                return messages;
            })
            .then(function (retorno) {
                //console.log(retorno.payload.facebook.attachment.payload)
                resolve(retorno);
            })
    })
}

function callExternalAPI(messages, token, senderID, pageID) {
    //console.log('callExternalAPI')
    //console.log(messages)
    return new Promise(function (resolve, reject) {

        const endpoint = messages.payload.API;
        const param = messages.payload.param;

        param.senderID = senderID;
        param.pageID = pageID;

        if (param.page_access_token || param.page_access_token != undefined)
            param.page_access_token = token;

        const objRequest = {
            url: process.env.URL_APICENTER + endpoint,
            method: 'POST',
            json: true,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': process.env.AUTHORIZATION_APICENTER
            },
            body: {
                param
            }
        }

        request(objRequest, (error, response) => {
            if (response.statusCode == 200) {
                //console.log('retorno nlp ' + response.statusCode)
                resolve(response.body);
            }
            else {
                reject(response.body);

                Log.Add('warning', null, null, "facebook.js", "callExternalAPI", "Erro ao enviar requisicao para APICenter do FacebookOrchestrator.", senderID, pageID, { request: objRequest, statusCode: response.statusCode });
            }
            if (error) {
                console.log(error)
                reject(error);

                Log.Add('error', null, null, "facebook.js", "callExternalAPI", "Erro ao enviar requisicao para APICenter do FacebookOrchestrator.", senderID, pageID, { request: objRequest, error: JSON.stringify(error), statusCode: response.statusCode });
            }
        });
    });
}

module.exports = new APICenter();