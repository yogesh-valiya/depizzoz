const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const AdminOrderController = require('../app/http/controllers/admin/orderController')

const guestMiddleware = require('../app/http/middlewares/guest')
const authMiddleware = require('../app/http/middlewares/auth')
const adminMiddleware = require('../app/http/middlewares/admin')

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

function initRoutes(app) {
    // Home page
    app.get("/", homeController().index)

    // Auth routes
    app.get("/login", guestMiddleware, authController().login)
    app.post("/login",  authController().postLogin)
    app.get("/register", guestMiddleware, authController().register)
    app.post("/register", authController().postRegister)
    app.get("/logout", authController().logout)

    // Cart routes
    app.get("/cart", cartController().index)
    app.post("/update-cart", cartController().update)

    // Order routes
    app.post("/placeOrder", authMiddleware, orderController().placeOrder)
    app.get("/customer/orders", authMiddleware, orderController().orders)

    // Admin routes
    app.get("/admin/orders", adminMiddleware, AdminOrderController().orders)


}

module.exports = initRoutes