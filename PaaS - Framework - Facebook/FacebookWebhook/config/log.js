var LogController = require('../controller/log');

function Log() { }

Log.prototype.Add = function (level, url, ip, file, method, message, sender, recipient, meta) {

    async.parallel([function (callback) {
        //setTimeout(function () {
        LogController.LogInsert(level, url, ip, file, method, message, sender, recipient, meta);
        //}, 5000);
    }]);
};

module.exports = new Log();