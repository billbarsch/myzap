const router = require('express').Router()

const util = require('util')
const childProcess = require('child_process')
const exec = util.promisify(childProcess.exec)

router.post('/exec', async (req, res) => {
  // edit this line on future
  const { stdout, stderr } = await exec(req.body.command)

  if (stderr) {
    return res.status(400).json(stderr)
  }

  return res.json(stdout)
})

module.exports = app => app.use(router)
