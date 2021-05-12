const router = require('express').Router()

const Sessions = require('../sessions')

router.get('/checkNumberStatus', async (req, res) => {
  const result = await Sessions.checkNumberStatus(req.body.sessionName, req.body.number)

  res.json(result)
})

module.exports = app => app.use(router)
