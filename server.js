const express = require('express')

const PORT = process.env.PORT || 3000

const app = express()

app.get("/", (req, resp) => {
    resp.end("Hello World...!")
})

app.listen(PORT, () => {
    console.log(`Listening on the port ${PORT} !`)
})
