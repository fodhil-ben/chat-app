const express = require('express')
const app = express()
const http = require('http')
const path = require('path')
const server = http.createServer(app)
const InitServer = require('./socket')
const db = require('./db')
const cors = require('cors')
const sign = require('./routes/sign')
const login = require('./routes/login')
const users = require('./routes/users')
const groups = require('./routes/groups')
const messages = require('./routes/messages')
require('dotenv').config()


app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cors({
    origin: process.env.NODE_ENV !== 'production' ? "http://localhost:5173" : "https://chat-app-i3zg.onrender.com"
}))


// ---------------deployement

const __dirname1 = path.resolve()
app.use('/api/sign', sign)
app.use('/api/login', login)
app.use('/api/users', users)
app.use('/api/groups', groups)
app.use('/api/messages', messages)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, "frontend", "dist")))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"))
    })
} else {
    app.get('/', (req, res) => {
        res.send('API is running')
    })
}

// ---------------deployement




db.connect(err => {
    if (err) console.log(`Error connecting to the database: ${err}`)
    else {
        console.log(`Success connecting to database`)
        InitServer(server)
        server.listen(process.env.PORT, () => {

            console.log(`Listening on port ${process.env.PORT}`)
        })
    }
})


