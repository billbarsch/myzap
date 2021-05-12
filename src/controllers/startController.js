const router = require('express').Router()

const Sessions = require('../sessions')

router.get('/start', (req, res) => {
  console.log('Starting', req.query.sessionName)

  const session = async () => {
    if (process.env.JSONBINIO_SECRET_KEY) {
      return await Sessions.start(req.query.sessionName, {
        jsonbinio_secret_KEY: process.env.JSONBINIO_SECRET_KEY,
        jsonbinio_bin_id: process.env.JSONBINIO_BIN_ID
      })
    }
  }

  if (['CONNECTED', 'QRCODE', 'STARTING'].includes(session.state)) {
    return res.json({ result: 'success', message: session.state })
  } else {
    return res.status(400).json({ result: 'error', message: session.state })
  }
})

module.exports = app => app.use(router)
