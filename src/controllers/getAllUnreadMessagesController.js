const router = require('express').Router()

const Sessions = require('../sessions')

router.get('/getAllUnreadMessages', async (req, res) => {
  const result = await Sessions.getAllUnreadMessages(req.body.sessionName)

  res.json(result)
})

module.exports = app => app.use(router)
