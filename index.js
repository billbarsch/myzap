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
app.use(express.json());

if (process.env.HTTPS == 1) { //with ssl
    https.createServer(
        {
            key: fs.readFileSync(process.env.SSL_KEY_PATH),
            cert: fs.readFileSync(process.env.SSL_CERT_PATH)
        },
        app).listen(process.env.HOST_PORT);
    console.log("Https server running on port " + process.env.HOST_PORT);
} else { //http
    app.listen(process.env.HOST_PORT, () => {
        console.log("Http server running on port " + process.env.HOST_PORT);
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
    var session = await Sessions.start(
        req.query.sessionName,
        {
            jsonbinio_secret_key: process.env.JSONBINIO_SECRET_KEY,
            jsonbinio_bin_id: process.env.JSONBINIO_BIN_ID
        }
    );

    if (["CONNECTED", "QRCODE", "STARTING"].includes(session.state)) {
        res.status(200).json({ result: 'success', message: session.state });
    } else {
        res.status(200).json({ result: 'error', message: session.state });
    }
});//start

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

app.post("/sendText", async function sendText(req, res, next) {
    var result = await Sessions.sendText(
        req.body.sessionName,
        req.body.number,
        req.body.text
    );
    //console.log(req.body);
    res.json(result);
});//sendText

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

app.get("/close", async (req, res, next) => {
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
