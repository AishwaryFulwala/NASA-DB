const port = process.env.port || 5000

const https = require('https')
const fs = require('fs')

require('dotenv').config()

const app = require('./app')

const { mongoConnect } = require('./services/mongo')
const { loadPlantes } = require('./models/planets.model')
const { loadlaunches } = require('./models/launches.model')

const server = https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}, app)

async function startServer() {
    await mongoConnect()
    await loadPlantes()
    await loadlaunches()

    server.listen(port, () => {
        console.log(port)
    })
}

startServer()