require('dotenv').config()

const express = require('express')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const mongo = require('mongoose')
const session = require('express-session')

const connectionString = process.env.MONGODB_CONNECTION_STRING
console.log(connectionString)

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

const app = express()

app.use(expressLayout)
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000*60*60*24}
}))
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

// Assets
app.use(express.static('public'))

require('./routes/web')(app)

app.listen(PORT, () => {
    console.log(`Listening on the port ${PORT} !`)
})
