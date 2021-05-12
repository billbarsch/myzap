const router = require('express').Router()

const Sessions = require('../sessions')

router.post('/sendImageStorie', async (req, res) => {
  const result = await Sessions.sendImageStorie(
    req.body.sessionName,
    req.body.base64Data,
    req.body.fileName,
    req.body.caption
  )

  res.json(result)
})

module.exports = app => app.use(router)
