//
const os = require('os');
const fs = require('fs');
const mime = require('mime-types');
const path = require('path');
const venom = require('venom-bot');
const {
    json
} = require('express');
const {
    Session
} = require('inspector');
//
//
// ------------------------------------------------------------------------------------------------------- //
//
//
module.exports = class Sessions {
    //
    static async start(sessionName) {
        console.log("- Criando sessão");
        Sessions.sessions = Sessions.sessions || []; //start array

        var session = Sessions.getSession(sessionName);

        if (session == false) {
            //create new session
            console.log("- Session: false");
            session = await Sessions.addSesssion(sessionName);
        } else if (["CLOSED"].includes(session.state)) {
            //restart session
            console.log("State: CLOSED");
            session.state = "STARTING";
            session.status = 'notLogged';
            session.client = Sessions.initSession(sessionName);
            Sessions.setup(sessionName);
        } else if (["CONFLICT", "UNPAIRED", "UNLAUNCHED"].includes(session.state)) {
            console.log("- client.useHere()");
            session.client.then(client => {
                client.useHere();
            });
        } else {
            console.log('- Status do sistema:', session.state);
            console.log('- Status da sessão:', session.status);
        }
        return session;
    } //start
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
    static async addSesssion(sessionName) {
        console.log("- Adicionando sessão");
        var newSession = {
            name: sessionName,
            qrcode: false,
            client: false,
            status: 'notLogged',
            state: 'STARTING'
        }
        Sessions.sessions.push(newSession);
        console.log("- Nova sessão: " + newSession.state);

        //setup session
        newSession.client = Sessions.initSession(sessionName);
        Sessions.setup(sessionName);

        return newSession;
    } //addSession
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
    static getSession(sessionName) {
        console.log("- Obtendo sessão");
        var foundSession = false;
        if (Sessions.sessions)
            Sessions.sessions.forEach(session => {
                if (sessionName == session.name) {
                    foundSession = session;
                }
            });
        return foundSession;
    } //getSession
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
    static getSessions() {
        if (Sessions.sessions) {
            return Sessions.sessions;
        } else {
            return [];
        }
    } //getSessions
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
    static async initSession(sessionName) {
        console.log("- Iniciando sistema");
        var session = Sessions.getSession(sessionName);
        const client = await venom.create(sessionName, (base64Qr, asciiQR) => {
                //
                session.state = "QRCODE";
                //
                console.log("- Captura do QR-Code");
                //console.log(base64Qr);
                session.qrcode = base64Qr;
                //
                console.log("- Captura do asciiQR");
                // Registrar o QR no terminal
                //console.log(asciiQR);
                session.CodeasciiQR = asciiQR;
                // Para escrevê-lo em outro lugar em um arquivo
                //exportQR(base64Qr, './public/images/marketing-qr.png');
                var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
                    response = {};

                if (matches.length !== 3) {
                    return new Error('- Invalid input string');
                }
                response.type = matches[1];
                response.data = new Buffer.from(matches[2], 'base64');

                var imageBuffer = response;
                require('fs').writeFile('./public/images/marketing-qr.png',
                    imageBuffer['data'],
                    'binary',
                    function(err) {
                        if (err != null) {
                            console.log(err);
                        }
                    }
                );
            }, (statusSession) => {
                console.log('- Status da sessão:', statusSession);
                //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail
                if(statusSession === 'qrReadSuccess'){
                    session.state = "PAIRING";
                }else if(statusSession === 'qrReadFail'){
                    session.state = "STARTING";
                    session.client = Sessions.initSession(sessionName);
                }
                session.status = statusSession;
            }, {
                headless: true, // Headless chrome
                devtools: false, // Open devtools by default
                useChrome: false, // If false will use Chromium instance
                debug: false, // Opens a debug session
                logQR: false, // Logs QR automatically in terminal
                //browserArgs: [''], // Parameters to be added into the chrome browser instance
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
                disableSpins: true, // Will disable Spinnies animation, useful for containers (docker) for a better log
                updates: true, // Logs info updates automatically in terminal
                autoClose: false, // Automatically closes the venom-bot only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
               }
        );
        return client;
    } //initSession
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
    static async setup(sessionName) {
        console.log("- Sinstema iniciado!");
        var session = Sessions.getSession(sessionName);
        await session.client.then(client => {
            // State change
            client.onStateChange((state) => {
                console.log('- Status do sistema:', state);
                session.state = state;
                const conflits = [
                venom.SocketState.CONFLICT,
                venom.SocketState.UNPAIRED,
                venom.SocketState.UNLAUNCHED,
                ];
                if (conflits.includes(state)) {
                client.useHere();
                }
            });
            //
            client.onMessage((message) => {
                if (message.body === 'Oi' && message.isGroupMsg === false) {
                    client
                        .sendText(message.from, '🕷 Welcome Venom Bot 🕸')
                        .then((result) => {
                            console.log('Result', result); //return object success
                        })
                        .catch((erro) => {
                            console.error('Error', erro); //return object error
                        });
                }
            });
        });
    } //setup
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
    static async closeSession(sessionName) {
        console.log("- Fechando sessão");
        var session = Sessions.getSession(sessionName);
        if (session) { //só adiciona se não existir
            if (session.state != "CLOSED") {
                if (session.client)
                    await session.client.then(async client => {
                        try {
                            await client.close();
                        } catch (error) {
                            console.log("- Erro ao fechar sistema:", error.message);
                        }
                        session.state = "CLOSED";
                        session.client = false;
                        console.log("- Sistema fechado");
                    });
                return {
                    result: "success",
                    state: session.state,
                    message: "Sistema fechado"
                };
            } else { //close
                return {
                    result: "success",
                    state: session.state,
                    message: "Sistema fechado"
                };
            }
        } else {
            return {
                result: "error",
                message: "NOTFOUND"
            };
        }
    } //closeSession
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
}