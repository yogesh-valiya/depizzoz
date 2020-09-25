const  auth = function (req, res, next) {
    if(!req.isAuthenticated()){
        let redirect
        let originalUrl = req.originalUrl
        if(originalUrl){
            redirect = '/login?redirect=' + originalUrl
        }else{
            redirect = '/login'
        }
        return res.redirect(redirect)
    }
    return next()
}

module.exports = auth