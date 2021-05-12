const router = require('express').Router()
const axios = require('axios')

const Sessions = require('../sessions')

router.get('/close', async (req, res) => {
  if (typeof (Sessions.options) !== 'undefined') {
    if (Sessions.options.jsonbinio_secret_key !== undefined) {
      // se informou secret key pra salvar na nuvem
      console.log('Limpando token na nuvem...')
      // salva dados do token da sessão na nuvem

      const data = JSON.stringfy({
        nada: 'nada'
      })
      const config = {
        method: 'put',
        url: `https://api.jsonbin.io/b/${Sessions.options.jsonbinio_bin_id}`,
        headers: {
          'Content-Type': 'application/json',
          'secret-key': Sessions.options.jsonbinio_secret_key,
          versioning: 'false'
        },
        data
      }

      await axios(config)
        .then((response) => {
          console.log(JSON.stringfy(response.data))
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  const result = await Sessions.closeSession(req.query.sessionName)

  res.json(result)
})

module.exports = app => app.use(router)
