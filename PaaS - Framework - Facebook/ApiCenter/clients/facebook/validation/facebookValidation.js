function FacebookValidation() {}

FacebookValidation.prototype.TokenValidation = function(req, res, next) {
    if(visaTokenValidation){
        next(req, res, next);
    }else{
        AuthorizedVISA.Authenticate(req, res, next);
    }    
};

FacebookValidation.prototype.TokenValidationHML = function(req, res, next) {
    if(visaTokenValidationHML){
        next(req, res, next);
    }else{
        AuthorizedVISA.AuthenticateHML(req, res, next);
    }    
};

module.exports = new FacebookValidation();