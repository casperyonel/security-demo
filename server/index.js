const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())

const {createMessage} = require('./controllers/ctrl.js')


app.post("/api/messages", createMessage)






let SERVER_PORT = 4004

app.listen (SERVER_PORT, () => {
    console.log(`Server is listening on port ${SERVER_PORT}`)
})
