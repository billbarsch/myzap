const router = require('express').Router()

const Sessions = require('../sessions')

router.post('/sendLocation', async (req, res) => {
  const result = await Sessions.sendLocation(
    req.body.sessionName,
    req.body.number,
    req.body.lat,
    req.body.long,
    req.body.local
  )

  res.json(result)
})

module.exports = app => app.use(router)
