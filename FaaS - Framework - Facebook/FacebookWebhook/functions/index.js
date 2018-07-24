const functions = require('firebase-functions');
const express = require('express');
const app = express();
request = require('request');
Promise = require("bluebird");
const bodyParser = require('body-parser');
firestore = require('./firestore')
moment = require('moment');

require('dotenv').load();

app.enable('trust proxy');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var Facebook = require('./facebook.js');

app.get('', (req, res) => {

    firestore.setLog('facebook', null, {
        level: "info",
        timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
        url: req.originalUrl,
        ip: req.ip,
        file: "index.js",
        method: "get",
        message: "Requisicao de verificacao de token recebida do Facebook Messenger.",
        senderID: null,
        recipientID: null,
        meta: req.query
    })

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = process.env.VALIDATION_TOKEN
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            // Responds with the challenge token from the request
            //console.log('verificado')
            res.status(200).send(challenge);
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);

            firestore.setLog('facebook', null, {
                level: "warning",
                timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }).toString()).format('DD-MM-YYYY HH:mm:ssS'),
                url: req.originalUrl,
                ip: req.ip,
                file: "index.js",
                method: "get",
                message: "Erro na verificacao de token recebida do Facebook Messenger.",
                senderID: null,
                recipientID: null,
                meta: req.query
            })
        }
    }
});

app.post('', (req, res) => {
    var data = req.body;
    // Make sure this is a page subscription
    if (data.object == 'page') {
        // Iterate over each entry
        // There may be multiple if batched
        data.entry.forEach(function (pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;

            if (pageEntry.messaging) {

                firestore.setLog(pageID, null, {
                    level: "info",
                    timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
                    url: req.originalUrl,
                    ip: req.ip,
                    file: "index.js",
                    method: "post",
                    message: "Requisicao recebida do Facebook Messenger.",
                    senderID: pageEntry.messaging[0].sender.id,
                    recipientID: pageEntry.messaging[0].recipient.id,
                    meta: req.body
                })

                // Iterate over each messaging event
                pageEntry.messaging.forEach(function (messagingEvent) {
                    if (messagingEvent.optin) {
                        //Facebook.receivedAuthentication(messagingEvent);
                    } else if (messagingEvent.message) {
                        Facebook.receivedMessage(messagingEvent);
                    } else if (messagingEvent.delivery) {
                        //Facebook.receivedDeliveryConfirmation(messagingEvent);
                    } else if (messagingEvent.postback) {
                        Facebook.receivedPostback(messagingEvent);
                    } else if (messagingEvent.read) {
                        //Facebook.receivedMessageRead(messagingEvent);
                    } else if (messagingEvent.account_linking) {
                        //Facebook.receivedAccountLink(messagingEvent);
                    } else {
                        console.log("Webhook received unknown messagingEvent: ", messagingEvent);

                        firestore.setLog(pageID, null, {
                            level: "warning",
                            timestamp: moment(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })).format(),
                            url: req.originalUrl,
                            ip: req.ip,
                            file: "index.js",
                            method: "post",
                            message: "Tipo de mensagem nao encontrado.",
                            senderID: pageEntry.messaging[0].sender.id,
                            recipientID: pageEntry.messaging[0].recipient.id,
                            meta: req.body
                        })
                    }
                });
            }
        });
        //console.log('webhook')
        res.send();
    }
});

exports.webhook = functions.https.onRequest(app);