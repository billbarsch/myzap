const router = require('express').Router()

const Sessions = require('../sessions')

router.post('/sendLink', async (req, res) => {
  const result = await Sessions.sendLinkPreview(
    req.body.sessionName,
    req.body.number,
    req.body.url,
    req.body.caption
  )

  res.json(result)
})

module.exports = app => app.use(router)
