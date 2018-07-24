function firestore() { }

const admin = require('firebase-admin');

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hml-facebookorchestrator.firebaseio.com"
});
var db = admin.firestore();

firestore.prototype.setLog = function (collection, documents, data) {
    if(documents == null){
        db.collection(collection).add(data)
        .then(ref=>{
            //console.log(ref.id)
        }).catch((err) => {
            console.log('Error add documents', err);
        });
    }else{
        db.collection(collection).doc(documents).set(data)
        .then(ref=>{
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

firestore.prototype.upd = function (event) {
    db.collection('users').update({ capital: true });
}

module.exports = new firestore();