const https = require('https')
const express = require('express')
const cors = require('cors')
const fs = require('fs')

require('dotenv').config()
const Sessions = require('./sessions')

const app = express()
const port = process.env.PORT || 3333

app.use(cors())
app.use(express.json({ limit: '20mb', extended: true }))

app.get('/', (req, res) => {
  return res.json({ result: 'ok' })
})

require('./controllers/execController')(app)
require('./controllers/startController')(app)
require('./controllers/statusController')(app)
require('./controllers/qrcodeController')(app)
require('./controllers/sendHookController')(app)
require('./controllers/sendTextController')(app)
require('./controllers/sendTextToStorieController')(app)
require('./controllers/sendFileController')(app)
require('./controllers/sendImageStorieController')(app)
require('./controllers/sendLinkController')(app)
require('./controllers/sendContactVcardController')(app)
require('./controllers/sendVoiceController')(app)
require('./controllers/sendLocationController')(app)
require('./controllers/getAllChatsNewMsgController')(app)
require('./controllers/getAllUnreadMessagesController')(app)
require('./controllers/checkNumberStatusController')(app)
require('./controllers/getNumberProfileController')(app)
require('./controllers/closeController')(app)

process.stdin.resume() // o the program will not close instantly

async function exitHandler (options, exitCode) {
  if (options.cleanup) {
    console.log('cleanup')

    await Sessions.getSession().forEach(async session => {
      await Sessions.closeSession(session.sessionName)
    })
  } else if (exitCode || exitCode === 0) {
    console.log(exitCode)
  } else if (options.exit) {
    process.exit()
  }
}

process.on('exit', exitHandler.bind(null, { cleanup: true }))
process.on('SIGINT', exitHandler.bind(null, { exit: true }))
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }))
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }))
process.on('uncaughtException', exitHandler.bind(null, { exit: true }))

if (process.env.HTTPS === 1) {
  https.createServer({
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH)
  }, app).listen(port, () => {
    console.log(`HTTPS server running on port ${port}`)
  })
} else {
  app.listen(port, () => {
    console.log(`HTTP server running on port ${port}`)
  })
}

app.listen(port)
