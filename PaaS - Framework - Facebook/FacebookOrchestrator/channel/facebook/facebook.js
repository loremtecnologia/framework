function Facebook() { }

Facebook.prototype.formatMessageToFacebook = function (req, res, next) {
    // console.log('MMMMMMMMMMMMMMM')
    // console.log(JSON.stringify(res.Messages))
    // console.log('MMMMMMMMMMMMMMM')
    if (res.CLIENT.Platform == "Dialogflow") {
        Dialogflow.Format(res.Messages)
            .then(function (retorno) {
                // console.log('FFFFFFFFFFFFF')
                // console.log(retorno)
                // console.log('FFFFFFFFFFFFF')
                var sentMessage = recurseSendMessageDialogflow(res.CLIENT.Facebook, res.senderID, retorno, [], req.body.recipient.id);
                return (sentMessage);
            })
            .then(function (retorno) {
                //console.log(res)
                // console.log('---------------')
                // console.log(retorno)
                // console.log('---------------')
                res.sendedToFacebook = JSON.parse(JSON.stringify(retorno));
                next();
            })
    }
    else if (res.CLIENT.Platform == "Watson") {
        recurseSendMessageWatson(res.CLIENT.Facebook, res.senderID, res.Messages, [], req.body.recipient.id)
            .then(function (retorno) {
                //console.log(res)
                // console.log('---------------')
                // console.log(retorno)
                // console.log('---------------')
                res.sendedToFacebook = JSON.parse(JSON.stringify(retorno));
                next();
            })
    }
}

function recurseSendMessageDialogflow(facebook, senderID, messages, listMessages, pageID) {
    function fibonacci(num) {
        if (num <= 1) return 1;

        return fibonacci(num - 1) + fibonacci(num - 2);
    }

    var fibo = fibonacci(listMessages.length);
    fibo = fibo * 1500;
    diferenca = 0;
    var start;
    var end;

    //console.log('send')
    var sentMessage = Promise.resolve()
        .then(function () {
            return Dialogflow.sendTypingOn(facebook.PAGE_ACCESS_TOKEN, senderID, pageID);
        })
        .then(function () {
            //verificar API
            if (messages[0].payload && messages[0].payload.API) {
                start = moment(new Date())
                //console.log('sim')
                return APICenter.externalAPI(messages[0], facebook.PAGE_ACCESS_TOKEN, senderID, pageID);
            } else {
                //console.log('nao')
                return messages[0];
            }
        })
        .then(function (retorno) {
            end = moment(new Date())

            if (start != undefined) {
                diferenca = end.diff(start, 'milliseconds')
            }

            return retorno;
        })
        .delay(fibo - diferenca).then(function (retorno) {
            if (retorno.text) {
                return Dialogflow.sendTextMessage(facebook.PAGE_ACCESS_TOKEN, senderID, retorno.text, pageID);
            }
            else if (retorno.elements) {
                return Dialogflow.sendCardMessage(facebook.PAGE_ACCESS_TOKEN, senderID, retorno.elements, pageID);
            }
            else if (retorno.quickReplies) {
                return Dialogflow.sendQuickReply(facebook.PAGE_ACCESS_TOKEN, senderID, retorno.quickReplies.title, retorno.quickReplies.quickReplies, pageID);
            }
            else if (retorno.image) {
                return Dialogflow.sendImageMessage(facebook.PAGE_ACCESS_TOKEN, senderID, retorno.image.imageUri, pageID);
            }
            else if (retorno.payload) {
                return Dialogflow.sendCustomMessage(facebook.PAGE_ACCESS_TOKEN, senderID, retorno.payload.facebook, pageID);
            }
        })
        .then(function (retorno) {
            listMessages.push(retorno);
            // console.log('999999999999999999999999')
            // console.log(listMessages)
            // console.log('999999999999999999999999')
            //      console.log('retorno send ' + retorno)
            messages.shift()
            if (messages.length > 0) {
                return (recurseSendMessageDialogflow(facebook, senderID, messages, listMessages, pageID)); // RECURSE!
            }
            else
                return listMessages;
        })
    return (sentMessage)
}

function recurseSendMessageWatson(facebook, senderID, messages, listMessages, pageID) {
    console.log('****')
    console.log(JSON.stringify(messages))
    console.log('****')
    function fibonacci(num) {
        if (num <= 1) return 1;

        return fibonacci(num - 1) + fibonacci(num - 2);
    }

    var fibo = fibonacci(listMessages.length);
    fibo = fibo * 1500;
    diferenca = 0;
    var start;
    var end;

    //console.log('send')
    var sentMessage = Promise.resolve()
        .then(function () {
            return Watson.sendTypingOn(facebook.PAGE_ACCESS_TOKEN, senderID, pageID);
        })
        .then(function () {
            //verificar API          
            if (messages.messages && messages.messages[0].payload && messages.messages[0].payload.API) {
                start = moment(new Date())
                //console.log('sim')
                return APICenter.externalAPI(messages.messages[0], facebook.PAGE_ACCESS_TOKEN, senderID, pageID);
            }
            else if (messages.generic) {
                return messages.generic[0];
            }
            else {
                //console.log('nao')
                return messages.messages[0];
            }
        })
        .then(function (retorno) {
            end = moment(new Date())

            if (start != undefined) {
                diferenca = end.diff(start, 'milliseconds')
            }

            return retorno;
        })
        .delay(fibo - diferenca).then(function (retorno) {
            console.log('------------')
            console.log(retorno)
            console.log('------------')
            if (retorno.payload) {
                return Watson.sendCustomMessage(facebook.PAGE_ACCESS_TOKEN, senderID, retorno.payload.facebook, pageID);
            }
            else if (retorno.response_type == "text") {
                return Watson.sendTextMessage(facebook.PAGE_ACCESS_TOKEN, senderID, retorno, pageID);
            }
        })
        .then(function (retorno) {
            if (messages.generic) {
                console.log('generic')
                console.log(messages)
                console.log('generic')
                listMessages.push(retorno);
                //      console.log('retorno send ' + retorno)
                messages.generic.shift()
                console.log(messages.generic)
                if (messages.generic.length > 0) {
                    return (recurseSendMessageWatson(facebook, senderID, messages, listMessages, pageID)); // RECURSE!
                }
                else
                    return listMessages;
            }
            else {
                console.log('messages')
                console.log(messages)
                console.log('messages')
                listMessages.push(retorno);
                //      console.log('retorno send ' + retorno)
                messages.messages.shift()
                console.log(messages.messages)
                if (messages.messages.length > 0) {
                    return (recurseSendMessageWatson(facebook, senderID, messages, listMessages, pageID)); // RECURSE!
                }
                else
                    return listMessages;
            }
        })
    return (sentMessage)
}

// function externalAPI(messages, token, senderID, pageID) {
//     //console.log('externalAPI')
//     // console.log('---------')
//     // console.log(messages)
//     // console.log('---------')
//     return new Promise(function (resolve, reject) {
//         callExternalAPI(messages, token, senderID, pageID)
//             .then(function (retorno) {
//                 //console.log(retorno)
//                 return percorrer(messages, retorno, 0)
//                 //console.log(teste.attachment.payload)
//                 function percorrer(obj, retornoAPI, count) {
//                     for (var propriedade in obj) {
//                         //console.log(propriedade)
//                         if (obj.hasOwnProperty(propriedade)) {
//                             if (typeof obj[propriedade] == "object") {
//                                 if (Array.isArray(obj[propriedade])) {
//                                     // console.log(propriedade)
//                                     // console.log('propriedade %%%%%%%%%%%%%%%%%%%')
//                                     retornoAPI = retornoAPI[propriedade];
//                                     if (retornoAPI != undefined) {
//                                         // console.log('RRRRRRRRRRRRRRR')
//                                         // console.log(retornoAPI)
//                                         // console.log('RRRRRRRRRRRRRRR')
//                                         var diferenca = retornoAPI.length - obj[propriedade].length;
//                                         //console.log(diferenca)
//                                         //console.log('diferenca')
//                                         for (let index = 0; index < diferenca; index++) {
//                                             //console.log('add linha')
//                                             obj[propriedade].push(JSON.parse(JSON.stringify(obj[propriedade][0])));
//                                         }
//                                         obj[propriedade].forEach(function (item, index) {
//                                             for (key2 in item) {
//                                                 if (typeof item[key2] == "object") {
//                                                     //console.log('OBJECT ******************')
//                                                     if (Array.isArray(item[key2])) {
//                                                         let _Obj = {
//                                                             [key2]: item[key2]
//                                                         }
//                                                         percorrer(_Obj, retornoAPI[index], count++);
//                                                     }
//                                                     else {
//                                                         percorrer(_Obj, retornoAPI, count++);
//                                                     }

//                                                 }
//                                                 else {
//                                                     //console.log('NAO É OBJECT ********')
//                                                     //console.log(item[key2])
//                                                     if (item[key2].toString().indexOf('<%=') > -1) {
//                                                         //console.log(propriedade)
//                                                         //console.log(item[key2])
//                                                         let variable = item[key2].substring(item[key2].lastIndexOf("<%=") + 3, item[key2].lastIndexOf("%>")).trim();
//                                                         //  console.log('variable',variable)
//                                                         //  console.log(index)
//                                                         //  console.log(retornoAPI)
//                                                         //  console.log('api', retornoAPI[index][variable])
//                                                         item[key2] = JSON.parse(JSON.stringify(ejs.render(item[key2], { [variable]: retornoAPI[index][variable] })));
//                                                         //item[key2] = JSON.parse(JSON.stringify(ejs.render([item[key2]], { [key2]: retornoAPI[index][key2] })));
//                                                         // console.log('TTTTTTTTTTTTTTTTTTTTTTTT')
//                                                         // console.log(obj[propriedade][index])
//                                                         // console.log('TTTTTTTTTTTTTTTTTTTTTTTT')
//                                                     }
//                                                 }
//                                             }
//                                         });
//                                     }
//                                 } else {
//                                     percorrer(obj[propriedade], retornoAPI, count++);
//                                 }
//                             } else {
//                                 if (obj[propriedade].toString().indexOf('<%=') > -1) {
//                                     //console.log(obj[propriedade])
//                                     let variable = obj[propriedade].substring(obj[propriedade].lastIndexOf("<%=") + 3, obj[propriedade].lastIndexOf("%>")).trim();
//                                     //console.log(variable)
//                                     obj[propriedade] = ejs.render(obj[propriedade], { [variable]: retorno[variable] });
//                                     //obj[propriedade] = ejs.render(obj[propriedade], { [propriedade]: retorno[propriedade] });
//                                 }
//                             }
//                         }
//                     }
//                     return obj;
//                 }
//             }, function (erro) {
//                 //console.log('-----------------')
//                 console.log(erro)
//                 return messages;
//             })
//             .then(function (retorno) {
//                 //console.log(retorno.payload.facebook.attachment.payload)
//                 resolve(retorno);
//             })
//     })
// }

// function callExternalAPI(messages, token, senderID, pageID) {
//     //console.log('callExternalAPI')
//     //console.log(messages)
//     return new Promise(function (resolve, reject) {

//         const endpoint = messages.payload.API;
//         const param = messages.payload.param;

//         param.senderID = senderID;
//         param.pageID = pageID;

//         if (param.page_access_token || param.page_access_token != undefined)
//             param.page_access_token = token;

//         const objRequest = {
//             url: process.env.URL_APICENTER + endpoint,
//             method: 'POST',
//             json: true,
//             headers: {
//                 'Content-Type': 'application/json; charset=utf-8',
//                 'Authorization': process.env.AUTHORIZATION_APICENTER
//             },
//             body: {
//                 param
//             }
//         }

//         request(objRequest, (error, response) => {
//             if (response.statusCode == 200) {
//                 //console.log('retorno nlp ' + response.statusCode)
//                 resolve(response.body);
//             }
//             else {
//                 reject(response.body);

//                 Log.Add('warning', null, null, "facebook.js", "callExternalAPI", "Erro ao enviar requisicao para APICenter do FacebookOrchestrator.", senderID, pageID, { request: objRequest, statusCode: response.statusCode });
//             }
//             if (error) {
//                 console.log(error)
//                 reject(error);

//                 Log.Add('error', null, null, "facebook.js", "callExternalAPI", "Erro ao enviar requisicao para APICenter do FacebookOrchestrator.", senderID, pageID, { request: objRequest, error: JSON.stringify(error), statusCode: response.statusCode });
//             }
//         });
//     });
// }

// var sendTypingOn = function (token, recipientId, pageID) {
//     return new Promise(function (resolve, reject) {
//         var messageData = {
//             recipient: {
//                 id: recipientId
//             },
//             sender_action: "typing_on"
//         };
//         callSendAPI(token, messageData, resolve, reject, pageID);
//     })
// }

// var sendTextMessage = function (token, recipientId, messageText, pageID) {
//     return new Promise(function (resolve, reject) {
//         var messageData = {
//             recipient: {
//                 id: recipientId
//             },
//             message: {
//                 text: messageText.text[0]
//             }
//         };
//         callSendAPI(token, messageData, resolve, reject, pageID);
//     })
// }

// var sendImageMessage = function (token, recipientId, imageUrl, pageID) {
//     return new Promise(function (resolve, reject) {
//         var messageData = {
//             recipient: {
//                 id: recipientId
//             },
//             message: {
//                 attachment: {
//                     type: "image",
//                     payload: {
//                         url: imageUrl
//                     }
//                 }
//             }
//         };
//         callSendAPI(token, messageData, resolve, reject, pageID);
//     })
// }

// var sendQuickReply = function (token, recipientId, title, replies, pageID) {
//     return new Promise(function (resolve, reject) {
//         var _replies = [];
//         replies.forEach(function (rep) {
//             var _rep = {
//                 "content_type": "text",
//                 "title": rep,
//                 "payload": rep
//             }
//             _replies.push(_rep);
//         });

//         var messageData = {
//             recipient: {
//                 id: recipientId
//             },
//             message: {
//                 text: title,
//                 quick_replies: _replies
//             }
//         };
//         callSendAPI(token, messageData, resolve, reject, pageID);
//     })
// }

// var sendCardMessage = function (token, recipientId, cards, pageID) {
//     return new Promise(function (resolve, reject) {
//         var messageData = {
//             recipient: {
//                 id: recipientId
//             },
//             message: {
//                 attachment: {
//                     type: "template",
//                     payload: {
//                         template_type: "generic",
//                         elements: cards
//                     }
//                 }
//             }
//         };
//         callSendAPI(token, messageData, resolve, reject, pageID);
//     })
// }

// var sendCustomMessage = function (token, recipientId, template, pageID) {
//     return new Promise(function (resolve, reject) {
//         var messageData = {
//             recipient: {
//                 id: recipientId
//             },
//             message: template
//         };
//         callSendAPI(token, messageData, resolve, reject, pageID);
//     })
// }

Facebook.prototype.callSendAPI = function (token, messageData, pageID) {
    return new Promise(function (resolve, reject) {
        const objRequest = {
            uri: 'https://graph.facebook.com/v3.0/me/messages',
            qs: { access_token: token },
            method: 'POST',
            json: messageData
        }

        request(objRequest, function (error, response, body) {
            if (response.statusCode == 200) {
                var recipientId = body.recipient_id;
                var messageId = body.message_id;

                if (recipientId) {
                    resolve(messageData)
                } else {
                    resolve('enviou mensagem')
                }
            } else {
                reject(body.error)

                Log.Add('warning', null, null, "facebook.js", "callSendAPI", "Erro ao enviar requisicao de Messagem para o facebook Messager do FacebookOrchestrator.", null, pageID, { request: objRequest, statusCode: response.statusCode });
            }
            if (error) {
                reject(error);

                Log.Add('error', null, null, "facebook.js", "callSendAPI", "Erro ao enviar requisicao de Messagem para o facebook Messager do FacebookOrchestrator.", null, pageID, { request: objRequest, error: JSON.stringify(error), statusCode: response.statusCode });
            }
        });
    })
}

module.exports = new Facebook();