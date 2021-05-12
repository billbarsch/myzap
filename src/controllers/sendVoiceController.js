const router = require('express').Router()

const Sessions = require('../sessions')

router.post('/sendVoice', async (req, res) => {
  const result = await Sessions.sendVoice(
    req.body.sessionName,
    req.body.number,
    req.body.voice
  )

  res.json(result)
})

module.exports = app => app.use(router)
