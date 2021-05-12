const router = require('express').Router()

const Sessions = require('../sessions')

router.post('/sendText', async (req, res) => {
  const result = await Sessions.sendText(req)

  res.json(result)
})

module.exports = app => app.use(router)
