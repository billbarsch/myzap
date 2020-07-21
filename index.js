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
    res.status(200).json({ result: 'success' });
    //res.json(Sessions.getSessions());
});

app.get("/message", async (req, res, next) => {
    Sessions.message(
        req.query.sessionName,
        req.query.number,
        req.query.text
    );
    res.json(req.query);
    //await client.sendMessageToId(req.query.number + '@c.us', req.query.message);
    //let chats = await client.getAllGroups();
    //res.json(req.query);
});

app.get("/qrcode", async (req, res, next) => {
    var qrcode = Sessions.getQrcode(req.query.sessionName);
    if (qrcode) { //notLogged
        if (req.query.image) {
            qrcode = qrcode.replace('data:image/png;base64,', '');
            const imageBuffer = Buffer.from(qrcode, 'base64');
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': imageBuffer.length
            });
            res.end(imageBuffer);
        } else {
            res.status(200).json({ result: 'success', qrcode: qrcode });
        }
    } else { //isLogged 
        res.status(401).json({ result: 'error', message: 'isLogged' });
    }
    //await client.sendMessageToId(req.query.number + '@c.us', req.query.message);
    //let chats = await client.getAllGroups();
    //res.json(req.query);
});

//close all sessions
process.on('SIGINT', function () {
    Sessions.sessions.forEach(session => {
        session.then((client) => {
            client.close();
        });
    });
});

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
