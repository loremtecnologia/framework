function firestore() { }

const admin = require('firebase-admin');

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://hml-apicenter.firebaseio.com"
});
var db = admin.firestore();

firestore.prototype.setLog = function (collection, documents, data) {
    if (documents == null) {
        db.collection(collection).add(data)
            .then(ref => {
                //console.log(ref.id)
            }).catch((err) => {
                console.log('Error add documents', err);
            });
    } else {
        db.collection(collection).doc(documents).set(data)
            .then(ref => {
                //console.log(ref)
            }).catch((err) => {
                console.log('Error set documents', err);
            });
    }
}

firestore.prototype.getLog = function (collection, documents) {
    db.collection(collection).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, '=>', doc.data());
            });
        })
        .catch((err) => {
            //console.log('Error getting documents', err);
        });
}

firestore.prototype.upd = function (collection, documents, data) {

    if (documents == null) {
        db.collection(collection).add(data)
            .then(ref => {
                //console.log(ref.id)
            }).catch((err) => {
                console.log('Error add documents', err);
            });
    } else {
        db.collection(collection).doc(documents).update(data)
            .then(ref => {
                //console.log(ref)
            }).catch((err) => {
                console.log('Error set documents', err);
            });
    }
}

firestore.prototype.select = function (collection, documents, resolve, reject) {
    db.collection(collection).doc(documents).get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No such document!');
            } else {
                resolve(doc.data())
                //console.log('Document data:', doc.data());
            }
        })
        .catch((err) => {
            //console.log('Error getting documents', err);
        });
}

module.exports = new firestore();