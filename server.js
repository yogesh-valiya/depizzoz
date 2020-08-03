const express = require('express')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')

const PORT = process.env.PORT || 3000

const app = express()

app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

app.get("/", (req, res) => {
    res.render("home", {layout: false})
})

app.listen(PORT, () => {
    console.log(`Listening on the port ${PORT} !`)
})