const router = require('express').Router()

const Sessions = require('../sessions')

router.post('/sendTextToStorie', async (req, res) => {
  const result = await Sessions.sendTextToStorie(req)

  res.json(result)
})

module.exports = app => app.use(router)
