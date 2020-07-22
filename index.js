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
    //while (session.status != '')
    res.status(200).json({ result: 'success' });
    //res.json(Sessions.getSessions());
});

app.get("/message", async (req, res, next) => {
    var result = Sessions.message(
        req.query.sessionName,
        req.query.number,
        req.query.text
    );
    res.json(result);
    //await client.sendMessageToId(req.query.number + '@c.us', req.query.message);
    //let chats = await client.getAllGroups();
    //res.json(req.query);
});

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
    //await client.sendMessageToId(req.query.number + '@c.us', req.query.message);
    //let chats = await client.getAllGroups();
    //res.json(req.query);
});

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, exitCode) {
    if (options.cleanup) {
        console.log('clean');
        Sessions.getSessions().forEach(session => {
            if (session.client)
                session.client.then(client => {
                    client.close();
                });
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

/*
//const client = venom.create().then((client) => start(client));
venom.create(
    "session1",
    (base64Qr, asciiQR) => {
        // To log the QR in the terminal
        console.log(asciiQR);
        // To write it somewhere else in a file
        exportQR(base64Qr, 'marketing-qr.png');
    },
    (statusFind) => {
        console.log(statusFind);
    },
    {
        headless: true,
        devtools: false,
        useChrome: false,
        debug: false,
        logQR: false,
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
            '--disable-accelerated-video-decode',
        ],
        refreshQR: 0,
        autoClose: false,
        disableSpins: true
    }).then((client) => start(client));

// Writes QR in specified path
function exportQR(qrCode, path) {
    qrCode = qrCode.replace('data:image/png;base64,', '');
    const imageBuffer = Buffer.from(qrCode, 'base64');

    // Creates 'marketing-qr.png' file
    fs.writeFileSync(path, imageBuffer);
}

function start(client) {

    var app = express();
    app.listen(3333, () => {
        console.log("Server running on port 3333");
    });

    app.get("/message", async (req, res, next) => {
        await client.sendMessageToId(req.query.number + '@c.us', req.query.message);
        //let chats = await client.getAllGroups();
        res.json(req.query);
    });

    client.onMessage((message) => {
        if (message.body === 'Hi') {
            client.sendText(message.from, 'Welcome Venom 🕷');
        }
    });
}*/
