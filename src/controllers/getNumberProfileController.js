const router = require('express').Router()

const Sessions = require('../sessions')

router.get('/getNumberProfile', async (req, res) => {
  const result = await Sessions.getNumberProfile(req.body.sessionName, req.body.number)

  res.json(result)
})

module.exports = app => app.use(router)
