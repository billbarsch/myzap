const router = require('express').Router()

const Sessions = require('../sessions')

router.post('/sendHook', async (req, res) => {
  const result = await Sessions.saveHook(req)

  res.json(result)
})

module.exports = app => app.use(router)
