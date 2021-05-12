const router = require('express').Router()

const Sessions = require('../sessions')

router.get('/getAllChatsNewMsg', async (req, res) => {
  const result = await Sessions.getAllChatsNewMsg(req.body.sessionName)

  res.json(result)
})

module.exports = app => app.use(router)
