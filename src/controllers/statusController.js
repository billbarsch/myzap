const router = require('express').Router()

const Sessions = require('../sessions')

router.get('/status', async (req, res) => {
  const session = await Sessions.getStatus(req.query.sessionName)

  console.log(session)

  return res.json({
    result: (!session.state) ? 'NOT_FOUND' : session.state
  })
})

module.exports = app => app.use(router)
