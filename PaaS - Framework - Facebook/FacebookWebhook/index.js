const express = require('express');
const app = express();
request = require('request');
Promise = require("bluebird");
const bodyParser = require('body-parser');
moment = require('moment');
async = require("async");

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

require('./db/connection');
Log = require('./config/log');

app.enable('trust proxy');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT;

var Facebook = require('./channel/facebook/facebook');

var router = express.Router();

router.get('/facebook/', (req, res) => {
    Log.Add('info', req.originalUrl, req.ip, "index.js", "get", "Requisicao de verificacao de token recebida do Facebook Messenger.", null, null, req.query);

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

            Log.Add('warning', req.originalUrl, req.ip, "index.js", "get", "Erro na verificacao de token recebida do Facebook Messenger.", null, null, req.query);
        }
    }
});

router.post('/facebook/', (req, res) => {
    var data = req.body;
    // Make sure this is a page subscription
    if (data.object == 'page') {
        // Iterate over each entry
        // There may be multiple if batched
        data.entry.forEach(function (pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;

            if (pageEntry.messaging) {

                Log.Add('info', req.originalUrl, req.ip, "index.js", "post", "Requisicao recebida do Facebook Messenger.", pageEntry.messaging[0].sender.id, pageEntry.messaging[0].recipient.id, req.body);

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

                        Log.Add('warning', req.originalUrl, req.ip, "index.js", "post", "Tipo de mensagem nao encontrado.", pageEntry.messaging[0].sender.id, pageEntry.messaging[0].recipient.id, req.body);
                    }
                });
            }
        });
        //console.log('webhook')
        res.send();
    }
});

router.post('/whatsapp/', (req, res) => {
    res.json();
});

app.use('/', router);

app.listen(port, function () {
    Log.Add('info', null, null, "index.js", "app.listen", "Servidor express foi iniciado com sucesso.", null, null, {port:port});
});