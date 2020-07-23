const express = require("express");
const Sessions = require("./sessions");
//const venom = require('venom-bot');
//const fs = require('fs');

var app = express();

app.listen(3333, () => {
    console.log("Server running on port 3333");
});

app.get("/start", async (req, res, next) => {
    await Sessions.start(req.query.sessionName);
    var session = Sessions.getSession(req.query.sessionName);
    var count = 0;
    while (["STARTING", "TIMEOUT"].includes(session.state)) {
        console.log("starting...")
        await new Promise(r => setTimeout(r, 1000)); //wait 1 second

        if (session.state == "QRCODE") {
            break;
        }

        count++;
        if (count > 60) { //60 seconds
            break; //exit loop
        }
    }
    if (session.state == "CONNECTED") {
        res.status(200).json({ result: 'success', message: session.state });
    } else if (session.state == "QRCODE") {
        res.status(200).json({ result: 'success', message: session.state });
    } else {
        res.status(400).json({ result: 'error', message: session.state });
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
            res.status(200).json({ result: 'success', qrcode: qrcodeResult.qrcode });
        }
    } else { //isLogged 
        res.status(401).json(qrcodeResult);
    }
});//qrcode

async function sendText(req, res, next) {
    var result = Sessions.sendText(
        req.body.sessionName,
        req.body.number,
        req.body.text
    );
    res.json(result);
}//sendText
app.get("/sendText", sendText);//sendText
app.post("/sendText", sendText);//sendText

async function sendFile(req, res, next) {
    var result = await Sessions.sendFile(
        req.body.sessionName,
        req.body.number,
        req.body.base64Data,
        req.body.fileName,
        req.body.caption
    );
    res.json(result);
}//sendFile
app.get("/sendFile", sendFile);//sendFile
app.post("/sendFile", sendFile);//sendFile

app.get("/close", async (req, res, next) => {
    var result = Sessions.closeSession(req.query.sessionName);
    res.json(result);
});//close

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, exitCode) {
    if (options.cleanup) {
        console.log('clean');
        Sessions.getSessions().forEach(session => {
            Sessions.closeSession(session.sessionName);
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
