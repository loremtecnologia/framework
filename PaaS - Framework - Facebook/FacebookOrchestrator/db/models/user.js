var Schema = mongoose.Schema;

var schema = new Schema({
        pageID: String,
        pageName: String,
        userID: String,
        userName: String,
        dialogflowContext: {type: Object},
        watsonContext: {type: Object},
        luisContext: {type: Object},
        timestamp: String
});

var LogModel = mongoose.model('user', schema, 'user');

module.exports = LogModel;