require('dotenv').config()

const express = require('express')
const ejs = require('ejs')
const path = require('path')
const mongo = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const expressLayout = require('express-ejs-layouts')
const flash = require('express-flash')
const Emitter = require('events')
const MongoStore = require('connect-mongo')(session)

const eventEmitter = new Emitter()
const connectionString = process.env.MONGODB_CONNECTION_STRING

mongo.connect(connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true
})
const connection = mongo.connection
connection.once('open', () => {
    console.log("Database connected...")
}).catch(err => {
    console.log("Connection failed...")
    console.log(err)
})

const PORT = process.env.PORT || 3000


const mongoStore = new MongoStore({
    mongooseConnection: connection,
    collection: 'session'
})

const app = express()

app.set('eventEmitter', eventEmitter)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

app.use(expressLayout)
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000*60*60*24},
    store: mongoStore
}))

// Assets
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(flash())

const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use((req, resp, next) => {
    resp.locals.session = req.session
    resp.locals.user = req.user
    next()
})

require('./routes/web')(app)

const server = app.listen(PORT, () => {
    console.log(`Listening on the port ${PORT} !`)
})


// Socket.IO integration
const io = require('socket.io')(server)
io.on('connection', socket => {
    socket.on('join', orderId => {
        console.log(orderId);
        socket.join(orderId)
    })
})

eventEmitter.on('orderUpdate', data => {
    io.to(`order_${data.orderId}`).emit('orderUpdate', {...data})
})