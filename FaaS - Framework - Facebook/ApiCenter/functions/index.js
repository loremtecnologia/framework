const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
request = require('request');
Promise = require("bluebird");
const bodyParser = require('body-parser');
nodemailer = require('nodemailer');

require('dotenv').load();

Util = require('./config/util');
filterResult = require('./config/filterResult');
var Authorized = require('./config/authorized');
var AuthorizedSKY = require('./clients/sky/config/authorized');
var AuthorizedUNIP = require('./clients/unip/config/authorized');

firestore = require('./firestore')
Log = require('./log.js');
moment = require('moment');
moment.locale('pt-BR');

app.use(cors({ origin: "*" }));
app.enable('trust proxy');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var RoutesFACEBOOK = require('./clients/facebook/config/routes');
var RoutesSKY = require('./clients/sky/config/routes');
var RoutesUNIP = require('./clients/unip/config/routes');

var router = express.Router();
router.post('/facebook/*', Authorized.Internal, RoutesFACEBOOK.Internal, (req, res) => {
    Log.setLog(req, res)
});

router.post('/skyprodutos/*', Authorized.Internal, RoutesSKY.Internal, (req, res) => {
    Log.setLog(req, res)
});

router.post('/sky/*', AuthorizedSKY.Geral, RoutesSKY.External, (req, res) => {
    //Log.setLog(req, res)

    res.json()
});

router.post('/unip/*', Authorized.Internal, RoutesUNIP.Internal, (req, res) => {
    Log.setLog(req, res)
});

app.use('/gDJw8MNHlXJI', router);

exports.apicenter = functions.https.onRequest(app);