const express = require("express");
const venom = require('venom-bot');
const fs = require('fs');

//const client = venom.create().then((client) => start(client));
venom.create(
    "session1",
    (base64Qr, asciiQR) => {
        // To log the QR in the terminal
        console.log(asciiQR);
        // To write it somewhere else in a file
        exportQR(base64Qr, 'marketing-qr.png');
    },
    null,
    {
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
}