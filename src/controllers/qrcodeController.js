const router = require('express').Router()

const Sessions = require('../sessions')

router.get('/qrcode', async (req, res) => {
  console.log('qrcode...', req.query.sessionName)

  const session = Sessions.getSession(req.query.sessionName)

  if (session !== false) {
    if (session.status !== 'isLogged') {
      if (req.query.image) {
        session.qrcode = session.qrcode.replace('data:image/png;base64,', '')

        const imageBuffer = Buffer.from(session.qrcode, 'base64')

        res.writeHead(200, {
          'Content-Type': 'image/png',
          'Content-Length': imageBuffer.length
        })

        res.end(imageBuffer)
      } else {
        res.json({
          result: 'success',
          message: session.state,
          qrcode: session.qrcode
        })
      }
    } else {
      res.send(400).json({
        result: 'error',
        message: session.state
      })
    }
  } else {
    res.status(400).json({
      result: 'error',
      message: 'NOTFOUND'
    })
  }
})

module.exports = app => app.use(router)
