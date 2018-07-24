var Schema = mongoose.Schema;

var schema = new Schema({
        level: String,
        timestamp: String,
        url: String,
        ip: String,
        file: String,
        method: String,
        message: String,
        senderID: String,
        recipientID: String,
        meta: {type: Object}
});

var LogModel = mongoose.model('apicenter', schema, 'apicenter');

module.exports = LogModel;