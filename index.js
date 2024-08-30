const express = require('express')
const cors = require('cors')
const events = require('events')
const bodyParser = require('body-parser')
require('dotenv').config()

const emmiter = new events.EventEmitter()
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())

app.get('/message', (req, res) => {
    emmiter.once('message', (message) => {
        console.log(message)
        return res.json(message)
    })
})

app.get('/event-soursing/connect', (req, res) => {
    res.writeHead(200, {
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
        "Cache-Control": 'no-cache'
    })
    emmiter.on('event-message', (message) => {
        res.write(`data: ${JSON.stringify(message)} \n\n\n`)
    })
    
})

app.post('/test', (req) => {
    console.log(req.body)
    console.log(req.params)
    console.log(req.query)
    console.log(req)
})

app.post('/message', (req, res) => {
    const message = req.body
    emmiter.emit('message', message)
    return res.status(200).json()
})

app.post('/event-soursing', (req, res) => {
    const message = req.body
    console.log(message)
    emmiter.emit('event-message', message)
    return res.status(200).json()
})

app.listen(process.env.PORT, () => {
    console.log('server started')
})