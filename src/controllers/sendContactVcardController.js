const router = require('express').Router()

const Sessions = require('../sessions')

router.post('/sendContactVcard', async (req, res) => {
  const result = await Sessions.sendContactVcard(
    req.body.sessionName,
    req.body.number,
    req.body.numberCard,
    req.body.nameCard
  )

  res.json(result)
})

module.exports = app => app.use(router)
