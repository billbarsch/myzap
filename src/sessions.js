// person.js
'use strict'

const os = require('os')
const fs = require('fs')
const path = require('path')
const venom = require('venom-bot')
const wppconnect = require('@wppconnect-team/wppconnect')
const axios = require('axios')

module.exports = class Sessions {
  static async start (sessionName, options = []) {
    Sessions.options = Sessions.options || options // start object
    Sessions.sessions = Sessions.sessions || [] // start array

    let session = Sessions.getSession(sessionName)

    if (session === false) { // create new session
      console.log('session == false')
      session = await Sessions.addSesssion(sessionName)
    } else if (['CLOSED'].includes(session.state)) { // restart session
      console.log('session.state == CLOSED')
      session.state = 'STARTING'
      session.status = 'notLogged'
      session.client = Sessions.initSession(sessionName)
      Sessions.setup(sessionName)
    } else if (['CONFLICT', 'UNPAIRED', 'UNLAUNCHED'].includes(session.state)) {
      console.log('client.useHere()')
      session.client.then(client => {
        client.useHere()
      })
    } else {
      console.log('session.state: ' + session.state)
    }
    return session
  } // start

  static async getStatus (sessionName, options = []) {
    Sessions.options = Sessions.options || options
    Sessions.sessions = Sessions.sessions || []

    const session = Sessions.getSession(sessionName)
    return session
  } // getStatus

  static async addSesssion (sessionName) {
    const newSession = {
      name: sessionName,
      hook: null,
      qrcode: false,
      client: false,
      status: 'notLogged',
      state: 'STARTING'
    }
    Sessions.sessions.push(newSession)
    console.log('newSession.state: ' + newSession.state)

    // setup session
    newSession.client = Sessions.initSession(sessionName)
    Sessions.setup(sessionName)

    return newSession
  } // addSession

  static async initSession (sessionName) {
    const session = Sessions.getSession(sessionName)
    session.browserSessionToken = null
    if (Sessions.options.jsonbinio_secret_key !== undefined) { // se informou secret key pra salvar na nuvem
      // busca token da session na nuvem
      const config = {
        method: 'get',
        url: 'https://api.jsonbin.io/b/' + Sessions.options.jsonbinio_bin_id,
        headers: {
          'secret-key': Sessions.options.jsonbinio_secret_key
        }
      }
      const response = await axios(config)
      if (response.data.WAToken1 !== undefined) {
        session.browserSessionToken = response.data
        console.log('puxou isso: ' + JSON.stringify(session.browserSessionToken))
      } else {
        console.log('nao tinha token na nuvem')
      }
    }// if jsonbinio_secret_key
    if (process.env.ENGINE === 'VENOM') {
      const client = await venom.create(
        sessionName,
        (base64Qr, asciiQR, attempts) => {
          session.state = 'QRCODE'
          session.qrcode = base64Qr
        },
        // statusFind
        (statusSession, session) => {
          console.log('#### status=' + statusSession + ' sessionName=' + session)
        }, {
          folderNameToken: 'tokens',
          headless: true,
          devtools: false,
          useChrome: false,
          debug: false,
          logQR: true,
          browserArgs: [
            '--log-level=3',
            '--no-default-browser-check',
            '--disable-site-isolation-trials',
            '--no-experiments',
            '--ignore-gpu-blacklist',
            '--ignore-certificate-errors',
            '--ignore-certificate-errors-spki-list',
            '--disable-gpu',
            '--disable-extensions',
            '--disable-default-apps',
            '--enable-features=NetworkService',
            '--disable-setuid-sandbox',
            '--no-sandbox',
            // Extras
            '--disable-webgl',
            '--disable-threaded-animation',
            '--disable-threaded-scrolling',
            '--disable-in-process-stack-traces',
            '--disable-histogram-customizer',
            '--disable-gl-extensions',
            '--disable-composited-antialiasing',
            '--disable-canvas-aa',
            '--disable-3d-apis',
            '--disable-accelerated-2d-canvas',
            '--disable-accelerated-jpeg-decoding',
            '--disable-accelerated-mjpeg-decode',
            '--disable-app-list-dismiss-on-blur',
            '--disable-accelerated-video-decode'
          ],
          refreshQR: 15000,
          autoClose: 60000,
          disableSpins: true,
          disableWelcome: false,
          createPathFileToken: true,
          waitForLogin: true
        },
        session.browserSessionToken
      )
      const browserSessionToken = await client.getSessionTokenBrowser()
      console.log('usou isso no create: ' + JSON.stringify(browserSessionToken))
      session.state = 'CONNECTED'
      return client
    } // initSession
    if (process.env.ENGINE === 'WPPCONNECT') {
      const client = await wppconnect.create({
        session: session.name,
        catchQR: (base64Qrimg, asciiQR, attempts, urlCode) => {
          session.state = 'QRCODE'
          session.qrcode = base64Qrimg
          session.CodeasciiQR = asciiQR
          session.CodeurlCode = urlCode
        },
        statusFind: (statusSession, session) => {
          console.log('- Status da sessão:', statusSession)
          console.log('- Session name: ', session)
        },
        folderNameToken: 'tokens',
        headless: true,
        devtools: false,
        useChrome: true,
        debug: false,
        logQR: true,
        browserArgs: [
          '--log-level=3',
          '--no-default-browser-check',
          '--disable-site-isolation-trials',
          '--no-experiments',
          '--ignore-gpu-blacklist',
          '--ignore-certificate-errors',
          '--ignore-certificate-errors-spki-list',
          '--disable-gpu',
          '--disable-extensions',
          '--disable-default-apps',
          '--enable-features=NetworkService',
          '--disable-setuid-sandbox',
          '--no-sandbox',
          // Extras
          '--disable-webgl',
          '--disable-threaded-animation',
          '--disable-threaded-scrolling',
          '--disable-in-process-stack-traces',
          '--disable-histogram-customizer',
          '--disable-gl-extensions',
          '--disable-composited-antialiasing',
          '--disable-canvas-aa',
          '--disable-3d-apis',
          '--disable-accelerated-2d-canvas',
          '--disable-accelerated-jpeg-decoding',
          '--disable-accelerated-mjpeg-decode',
          '--disable-app-list-dismiss-on-blur',
          '--disable-accelerated-video-decode'
        ],
        disableSpins: true,
        disableWelcome: false,
        updatesLog: true,
        autoClose: 60000,
        createPathFileToken: true,
        waitForLogin: true

      })
      wppconnect.defaultLogger.level = 'silly'
      session.state = 'CONNECTED'
      return client
    }
  }

  static async setup (sessionName) {
    const session = Sessions.getSession(sessionName)

    await session.client.then(client => {
      client.onStateChange(state => {
        session.state = state
        if (state === 'CONNECTED') {
          if (Sessions.options.jsonbinio_secret_key !== undefined && session.browserSessionToken === undefined) { // se informou secret key pra salvar na nuvem
            setTimeout(async () => {
              console.log('gravando token na nuvem...')
              // salva dados do token da sessão na nuvem
              const browserSessionToken = await client.getSessionTokenBrowser()
              const data = JSON.stringify(browserSessionToken)
              const config = {
                method: 'put',
                url: 'https://api.jsonbin.io/b/' + Sessions.options.jsonbinio_bin_id,
                headers: {
                  'Content-Type': 'application/json',
                  'secret-key': Sessions.options.jsonbinio_secret_key,
                  versioning: 'false'
                },
                data: data
              }
              await axios(config)
                .then(function (response) {
                  console.log(JSON.stringify(response.data))
                })
                .catch(function (error) {
                  console.log(error)
                })
            }, 2000)
          }// if jsonbinio_secret_key
        }// if CONNECTED
        console.log('session.state: ' + state)
      }) // .then((client) => Sessions.startProcess(client));
      client.onMessage(async (message) => {
        const session = Sessions.getSession(sessionName)
        if (session.hook != null) {
          const config = {
            method: 'post',
            url: session.hook,
            headers: {
              'Content-Type': 'application/json'
            },
            data: message
          }
          await axios(config)
            .then(function (response) {
              console.log(JSON.stringify(response.data))
            })
            .catch(function (error) {
              console.log(error)
            })
        } else if (message.body === 'TESTEBOT') {
          client.sendText(message.from, 'Hello\nfriend!')
        }
      })
    })
  } // setup

  static async closeSession (sessionName) {
    const session = Sessions.getSession(sessionName)
    if (session) { // só adiciona se não existir
      if (session.state !== 'CLOSED') {
        if (session.client) {
          await session.client.then(async client => {
            try {
              await client.close()
            } catch (error) {
              console.log('client.close(): ' + error.message)
            }
            session.state = 'CLOSED'
            session.client = false
            console.log('client.close - session.state: ' + session.state)
          })
        }
        return { result: 'success', message: 'CLOSED' }
      } else { // close
        return { result: 'success', message: session.state }
      }
    } else {
      return { result: 'error', message: 'NOTFOUND' }
    }
  } // close

  static getSession (sessionName) {
    let foundSession = false
    if (Sessions.sessions) {
      Sessions.sessions.forEach(session => {
        if (sessionName === session.name) {
          foundSession = session
        }
      })
    }
    return foundSession
  } // getSession

  static getSessions () {
    if (Sessions.sessions) {
      return Sessions.sessions
    } else {
      return []
    }
  } // getSessions

  static async getQrcode (sessionName) {
    const session = Sessions.getSession(sessionName)
    if (session) {
      // if (["UNPAIRED", "UNPAIRED_IDLE"].includes(session.state)) {
      if (['UNPAIRED_IDLE'].includes(session.state)) {
        // restart session
        await Sessions.closeSession(sessionName)
        Sessions.start(sessionName)
        return { result: 'error', message: session.state }
      } else if (['CLOSED'].includes(session.state)) {
        Sessions.start(sessionName)
        return { result: 'error', message: session.state }
      } else { // CONNECTED
        if (session.status !== 'isLogged') {
          return { result: 'success', message: session.state, qrcode: session.qrcode }
        } else {
          return { result: 'success', message: session.state }
        }
      }
    } else {
      return { result: 'error', message: 'NOTFOUND' }
    }
  } // getQrcode

  static async sendText (req) {
    const params = {
      sessionName: req.body.sessionName,
      number: req.body.number,
      text: req.body.text
    }
    const session = Sessions.getSession(params.sessionName)
    if (session) {
      if (session.state === 'CONNECTED') {
        await session.client.then(async client => {
          console.log('#### send msg =', params)
          return await client.sendText(params.number + '@c.us', params.text)
        })
        return { result: 'success' }
      } else {
        return { result: 'error', message: session.state }
      }
    } else {
      return { result: 'error', message: 'NOTFOUND' }
    }
  } // message

  static async sendTextToStorie (req) {
    const params = {
      sessionName: req.body.sessionName,
      text: req.body.text
    }
    const session = Sessions.getSession(params.sessionName)
    if (session) {
      if (session.state === 'CONNECTED') {
        await session.client.then(async client => {
          console.log('#### send msg =', params)
          return await client.sendText('status@broadcast', params.text)
        })
        return {
          result: 'success'
        }
      } else {
        return {
          result: 'error',
          message: session.state
        }
      }
    } else {
      return {
        result: 'error',
        message: 'NOTFOUND'
      }
    }
  } // message to storie

  static async sendFile (sessionName, number, base64Data, fileName, caption) {
    const session = Sessions.getSession(sessionName)
    if (session) {
      if (session.state === 'CONNECTED') {
        const resultSendFile = await session.client.then(async (client) => {
          const folderName = fs.mkdtempSync(path.join(os.tmpdir(), session.name + '-'))
          const filePath = path.join(folderName, fileName)
          fs.writeFileSync(filePath, base64Data, 'base64')
          console.log(filePath)
          return await client.sendFile(number + '@c.us', filePath, fileName, caption)
        }) // client.then(
        return { result: 'success' }
      } else {
        return { result: 'error', message: session.state }
      }
    } else {
      return { result: 'error', message: 'NOTFOUND' }
    }
  } // message

  static async sendImageStorie (sessionName, base64Data, fileName, caption) {
    const session = Sessions.getSession(sessionName)
    if (session) {
      if (session.state === 'CONNECTED') {
        const resultSendFile = await session.client.then(async (client) => {
          const folderName = fs.mkdtempSync(path.join(os.tmpdir(), session.name + '-'))
          const filePath = path.join(folderName, fileName)
          fs.writeFileSync(filePath, base64Data, 'base64')
          console.log(filePath)
          return await client.sendFile('status@broadcast', filePath, fileName, caption)
        }) // client.then(
        return {
          result: 'success'
        }
      } else {
        return {
          result: 'error',
          message: session.state
        }
      }
    } else {
      return {
        result: 'error',
        message: 'NOTFOUND'
      }
    }
  } // sendImageStorie

  static async saveHook (req) {
    const sessionName = req.body.sessionName
    /**
         * Verifica se encontra sessão
         */
    let foundSession = false
    let foundSessionId = null
    if (Sessions.sessions) {
      Sessions.sessions.forEach((session, id) => {
        if (sessionName === session.name) {
          foundSession = session
          foundSessionId = id
        }
      })
    }
    // Se não encontrar retorna erro
    if (!foundSession) {
      return { result: 'error', message: 'Session not found' }
    } else {
      // Se encontrar cria variáveis
      const hook = req.body.hook
      foundSession.hook = hook
      Sessions.sessions[foundSessionId] = foundSession
      return { result: 'success', message: 'Hook Atualizado' }
    }
  }

  static async sendContactVcard (sessionName, number, numberCard, nameCard) {
    const session = Sessions.getSession(sessionName)
    if (session) {
      if (session.state === 'CONNECTED') {
        const resultSendContactVcard = await session.client.then(async (client) => {
          return await client.sendContactVcard(number + '@c.us', numberCard + '@c.us', nameCard)
        }) // client.then(
        return {
          result: 'success'
        }
      } else {
        return {
          result: 'error',
          message: session.state
        }
      }
    } else {
      return {
        result: 'error',
        message: 'NOTFOUND'
      }
    }
  } // vcard

  static async sendVoice (sessionName, number, voice) {
    const session = Sessions.getSession(sessionName)
    if (session) {
      if (session.state === 'CONNECTED') {
        const resultSendVoice = await session.client.then(async (client) => {
          return await client.sendVoiceBase64(number + '@c.us', voice)
        }) // client.then(
        return {
          result: 'success'
        }
      } else {
        return {
          result: 'error',
          message: session.state
        }
      }
    } else {
      return {
        result: 'error',
        message: 'NOTFOUND'
      }
    }
  } // voice

  static async sendLocation (sessionName, number, lat, long, local) {
    const session = Sessions.getSession(sessionName)
    if (session) {
      if (session.state === 'CONNECTED') {
        const resultSendLocation = await session.client.then(async (client) => {
          return await client.sendLocation(number + '@c.us', lat, long, local)
        }) // client.then(
        return {
          result: 'success'
        }
      } else {
        return {
          result: 'error',
          message: session.state
        }
      }
    } else {
      return {
        result: 'error',
        message: 'NOTFOUND'
      }
    }
  } // location

  static async sendLinkPreview (sessionName, number, url, caption) {
    const session = Sessions.getSession(sessionName)
    if (session) {
      if (session.state === 'CONNECTED') {
        const resultSendLinkPreview = await session.client.then(async (client) => {
          return await client.sendLinkPreview(number + '@c.us', url, caption)
        }) // client.then(
        return {
          result: 'success'
        }
      } else {
        return {
          result: 'error',
          message: session.state
        }
      }
    } else {
      return {
        result: 'error',
        message: 'NOTFOUND'
      }
    }
  } // link

  static async getAllChatsNewMsg (sessionName) {
    const session = Sessions.getSession(sessionName)
    if (session) {
      if (session.state === 'CONNECTED') {
        const resultGetAllChatsNewMsg = await session.client.then(async (client) => {
          return client.getAllChatsNewMsg()
        })
        return {
          result: resultGetAllChatsNewMsg
        }
      } else {
        return {
          result: 'error',
          message: session.state
        }
      }
    } else {
      return {
        result: 'error',
        message: 'NOTFOUND'
      }
    }
  } // getAllChatsNewMsg

  static async getAllUnreadMessages (sessionName) {
    const session = Sessions.getSession(sessionName)
    if (session) {
      if (session.state === 'CONNECTED') {
        const resultGetAllUnreadMessages = await session.client.then(async (client) => {
          return await client.getAllUnreadMessages()
        })
        return {
          result: resultGetAllUnreadMessages
        }
      } else {
        return {
          result: 'error',
          message: session.state
        }
      }
    } else {
      return {
        result: 'error',
        message: 'NOTFOUND'
      }
    }
  } // getAllUnreadMessages

  static async checkNumberStatus (sessionName, number) {
    const session = Sessions.getSession(sessionName)
    // console.log(sessionName+number);
    if (session) {
      if (session.state === 'CONNECTED') {
        const resultcheckNumberStatus = await session.client.then(async (client) => {
          return await client.checkNumberStatus(number + '@c.us')
        })
        return {
          result: resultcheckNumberStatus
        }
      } else {
        return {
          result: 'error',
          message: session.state
        }
      }
    } else {
      return {
        result: 'error',
        message: 'NOTFOUND'
      }
    }
  } // saber se o número é válido

  static async getNumberProfile (sessionName, number) {
    const session = Sessions.getSession(sessionName)
    // console.log(sessionName+number);
    if (session) {
      if (session.state === 'CONNECTED') {
        const resultgetNumberProfile = await session.client.then(async (client) => {
          return await client.getNumberProfile(number + '@c.us')
        })
        return {
          result: resultgetNumberProfile
        }
      } else {
        return {
          result: 'error',
          message: session.state
        }
      }
    } else {
      return {
        result: 'error',
        message: 'NOTFOUND'
      }
    }
  } // receber o perfil do usuário
}