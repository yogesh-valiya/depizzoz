const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')

const guestMiddleware = require('../app/http/middlewares/guest')

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

function initRoutes(app) {
    app.get("/", homeController().index)

    app.get("/login", guestMiddleware, authController().login)
    app.post("/login",  authController().postLogin)
    app.get("/register", guestMiddleware, authController().register)
    app.post("/register", authController().postRegister)
    app.get("/logout", authController().logout)


    app.get("/cart", cartController().index)
    app.post("/update-cart", cartController().update)
}

module.exports = initRoutes