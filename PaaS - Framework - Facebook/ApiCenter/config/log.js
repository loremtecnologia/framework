var LogController = require('../controller/log');

function Log() { }

Log.prototype.Add = function (level, url, ip, file, method, message, sender, recipient, meta) {

    async.parallel([function (callback) {
        //setTimeout(function () {
        LogController.LogInsert(level, url, ip, file, method, message, sender, recipient, meta);
        //}, 5000);
    }]);
};

Log.prototype.setLog = function (req, res) {

    meta = { 
        In : {
            headers : req.headers,
            body : req.body        
        },       
        Out : {
            request : res.objRequest,
            response : res.retorno
        }
    }

    async.parallel([function (callback) {
        //setTimeout(function () {
        LogController.LogInsert('conversation', req.originalUrl, req.ip, "log.js", "post", "Requisicao recebida do FacebookOrchestrator.", req.body.param.senderID, req.body.param.pageID, meta);
        //}, 5000);
    }]);
}

module.exports = new Log();