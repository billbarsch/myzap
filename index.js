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
} else { //http
    app.listen(process.env.HOST_PORT, () => {
        console.log("Server running on port " + process.env.HOST_PORT);
    });
}//http

app.get("/start", async (req, res, next) => {
    Sessions.start(req.query.sessionName);
    var session = Sessions.getSession(req.query.sessionName);
    var count = 0;
    while (["STARTING", "TIMEOUT"].includes(session.state)) {
        console.log("starting..." + count);
        count++;
        if (count > 60) { //60 seconds
            break; //exit loop
        }
        await new Promise(r => setTimeout(r, 1000)); //wait 1 second
    }//while

    if (session.state == "CONNECTED") {
        res.status(200).json({ result: 'success', message: session.state });
    } else if (session.state == "QRCODE") {
        res.status(200).json({ result: 'success', message: session.state });
    } else {
        await Sessions.closeSession(req.query.sessionName);
        res.status(200).json({ result: 'error', message: session.state });
    }
});//start

app.get("/qrcode", async (req, res, next) => {

    var qrcodeResult = Sessions.getQrcode(req.query.sessionName);

    if (qrcodeResult.result == "success") { //notLogged
        if (req.query.image) {
            qrcodeResult.qrcode = qrcodeResult.qrcode.replace('data:image/png;base64,', '');
            const imageBuffer = Buffer.from(qrcodeResult.qrcode, 'base64');
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': imageBuffer.length
            });
            res.end(imageBuffer);
        } else {
            res.status(200).json(qrcodeResult);
        }
    } else { //isLogged 
        res.status(200).json(qrcodeResult);
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
