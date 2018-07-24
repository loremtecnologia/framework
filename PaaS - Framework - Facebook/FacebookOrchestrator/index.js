const express = require('express');
const app = express();
request = require('request');
Promise = require("bluebird");
async = require("async");
const bodyParser = require('body-parser');
ejs = require('ejs');
moment = require('moment');
moment.locale('pt-BR');
require('dotenv').load();

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

require('./db/connection');
Log = require('./config/log');

var port = process.env.PORT;

var router = express.Router();

app.enable('trust proxy');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const Authorization = require('./controller/authorization.js');
const User = require('./config/user');
const Client = require('./controller/client');

Facebook = require('./channel/facebook/facebook');

receivedMessage = require('./channel/facebook/receivedMessage');
receivedPostback = require('./channel/facebook/receivedPostback');

Dialogflow = require('./nlp/dialogflow');
Watson = require('./nlp/watson');

APICenter = require('./controller/apicenter');

TokenCache = require('google-oauth-jwt').TokenCache,
    tokens = new TokenCache();

router.post('/facebook/receivedMessage/',
    Authorization.Verify,
    User.GetContext,
    Client.Authentication,
    receivedMessage.messageToNLP,
    User.SendContext,
    Facebook.formatMessageToFacebook,
    (req, res) => {
        Log.setLog(req, res);
        res.send();
    }
);

router.post('/facebook/receivedPostback/',
    Authorization.Verify,
    User.GetContext,
    Client.Authentication,
    receivedPostback.messageToNLP,
    User.SendContext,
    Facebook.formatMessageToFacebook,
    (req, res) => {
        Log.setLog(req, res);
        res.send();
    }
);

router.post('/facebook/receivedAuthentication/', Authorization.Verify, (req, res) => {
    var event = req.body;
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfAuth = event.timestamp;

    // The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
    // The developer can set this to an arbitrary value to associate the 
    // authentication callback with the 'Send to Messenger' click event. This is
    // a way to do account linking when the user clicks the 'Send to Messenger' 
    // plugin.
    var passThroughParam = event.optin.ref;

    console.log("Received authentication for user %d and page %d with pass " +
        "through param '%s' at %d", senderID, recipientID, passThroughParam,
        timeOfAuth);

    Log.setLog(req, res);

    res.send();
});

router.post('/facebook/receivedDeliveryConfirmation/', Authorization.Verify, (req, res) => {
    var event = req.body;
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var delivery = event.delivery;
    var messageIDs = delivery.mids;
    var watermark = delivery.watermark;
    var sequenceNumber = delivery.seq;

    if (messageIDs) {
        messageIDs.forEach(function (messageID) {
            console.log("Received delivery confirmation for message ID: %s",
                messageID);
        });
    }

    Log.setLog(req, res);

    res.send();
});

router.post('/facebook/receivedMessageRead/', Authorization.Verify, (req, res) => {
    var event = req.body;
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;

    // All messages before watermark (a timestamp) or sequence have been seen.
    var watermark = event.read.watermark;
    var sequenceNumber = event.read.seq;

    console.log("Received message read event for watermark %d and sequence " +
        "number %d", watermark, sequenceNumber);

    Log.setLog(req, res);

    res.send();
});

router.post('/facebook/receivedAccountLink/', Authorization.Verify, (req, res) => {
    var event = req.body;
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;

    var status = event.account_linking.status;
    var authCode = event.account_linking.authorization_code;

    console.log("Received account link event with for user %d with status %s " +
        "and auth code %s ", senderID, status, authCode);

    Log.setLog(req, res);

    res.send();
});

app.use('/', router);

app.listen(port, function () {
    Log.Add('info', null, null, "index.js", "app.listen", "Servidor express foi iniciado com sucesso.", null, null, { port: port });
});