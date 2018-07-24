function Authorized() {}

Authorized.prototype.Geral = function(req, res, next) {
    if (req.headers.token == 'xYRHsrtVXGZLVtWUn'){
        next();
    } else {
        res.sendStatus(404);
    }
};

module.exports = new Authorized();