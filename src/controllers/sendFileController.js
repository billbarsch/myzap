const router = require('express').Router()

const Sessions = require('../sessions')

router.post('/sendFile', async (req, res) => {
  const result = await Sessions.sendFile(
    req.body.sessionName,
    req.body.number,
    req.body.base64Data,
    req.body.fileName,
    req.body.caption
  )

  res.json(result)
})

module.exports = app => app.use(router)
