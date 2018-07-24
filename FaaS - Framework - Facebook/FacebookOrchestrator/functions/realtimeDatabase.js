function realtimeDatabase() { }

const admin = require('firebase-admin');

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://hml-facebookorchestrator.firebaseio.com"
}, "realtime");

realtimeDatabase.prototype.getContext = function (pageID, userID) {
    return new Promise(function (resolve, reject) {
        admin.database().ref(pageID + '/' + userID).once('value').then(function (snapshot) {
            resolve(snapshot.val())
        });
    })
};

realtimeDatabase.prototype.setContext = function (pageID, userID, contexto) {
    admin.database().ref(pageID + '/' + userID).set(contexto);
};

module.exports = new realtimeDatabase();