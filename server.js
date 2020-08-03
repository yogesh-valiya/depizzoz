const express = require('express')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const mongo = require('mongoose')
const mongoCred = require("./MongoDBCreds")

const connectionString = mongoCred.MONGODB_CONNECTION_URL

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
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

// Assets
app.use(express.static('public'))

require('./routes/web')(app)

app.listen(PORT, () => {
    console.log(`Listening on the port ${PORT} !`)
})
