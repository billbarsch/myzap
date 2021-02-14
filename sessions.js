// person.js
'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
const venom = require('venom-bot');
const axios = require('axios');

module.exports = class Sessions {

    static async start(sessionName, options = []) {
        Sessions.options = Sessions.options || options; //start object
        Sessions.sessions = Sessions.sessions || []; //start array

        var session = Sessions.getSession(sessionName);

        if (session == false) { //create new session
            console.log("session == false");
            session = await Sessions.addSesssion(sessionName);
        } else if (["CLOSED"].includes(session.state)) { //restart session
            console.log("session.state == CLOSED");
            session.state = "STARTING";
            session.status = 'notLogged';
            session.client = Sessions.initSession(sessionName);
            Sessions.setup(sessionName);
        } else if (["CONFLICT", "UNPAIRED", "UNLAUNCHED"].includes(session.state)) {
            console.log("client.useHere()");
            session.client.then(client => {
                client.useHere();
            });
        } else {
            console.log("session.state: " + session.state);
        }
        return session;
    } //start

    static async addSesssion(sessionName) {
        var newSession = {
            name: sessionName,
            qrcode: false,
            client: false,
            status: 'notLogged',
            state: 'STARTING'
        }
        Sessions.sessions.push(newSession);
        console.log("newSession.state: " + newSession.state);

        //setup session
        newSession.client = Sessions.initSession(sessionName);
        Sessions.setup(sessionName);

        return newSession;
    } //addSession

    static async initSession(sessionName) {
        var session = Sessions.getSession(sessionName);
        session.browserSessionToken = null;
        if (Sessions.options.jsonbinio_secret_key !== undefined) {//se informou secret key pra salvar na nuvem
            //busca token da session na nuvem
            var config = {
                method: 'get',
                url: 'https://api.jsonbin.io/b/' + Sessions.options.jsonbinio_bin_id,
                headers: {
                    'secret-key': Sessions.options.jsonbinio_secret_key
                }
            };
            const response = await axios(config);
            if (response.data.WAToken1 !== undefined) {
                session.browserSessionToken = response.data;
                console.log("puxou isso: " + JSON.stringify(session.browserSessionToken));
            } else {
                console.log("nao tinha token na nuvem");
            }
        }//if jsonbinio_secret_key

        const client = await venom.create(
            sessionName,
            (base64Qr) => {
                session.state = "QRCODE";
                session.qrcode = base64Qr;
                console.log("new qrcode updated - session.state: " + session.state);
            },
            (statusFind) => {
                session.status = statusFind;
                console.log("session.status: " + session.status);
            }, {
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
            refreshQR: 15000,
            autoClose: 60 * 60 * 24 * 365, //never
            disableSpins: true
        },
            session.browserSessionToken
        );
        console.log("usou isso no create: " + JSON.stringify(session.browserSessionToken));
        return client;
    } //initSession

    static async setup(sessionName) {
        var session = Sessions.getSession(sessionName);
        await session.client.then(client => {
            client.onStateChange(state => {
                session.state = state;
                if (state == "CONNECTED") {
                    console.log("tem jsonbinio_secret_key");
                    if (Sessions.options.jsonbinio_secret_key !== undefined && session.browserSessionToken == undefined) {//se informou secret key pra salvar na nuvem
                        setTimeout(async () => {
                            console.log("gravando token na nuvem...");
                            //salva dados do token da sessão na nuvem
                            const browserSessionToken = await client.getSessionTokenBrowser();
                            var data = JSON.stringify(browserSessionToken);
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
                        }, 2000);
                    }//if jsonbinio_secret_key
                }//if CONNECTED
                console.log("session.state: " + state);
            }); //.then((client) => Sessions.startProcess(client));
            client.onMessage((message) => {
                if (message.body === 'hi') {
                    client.sendText(message.from, 'Hello\nfriend!');
                }
            });
        });
    } //setup

    static async closeSession(sessionName) {
        var session = Sessions.getSession(sessionName);
        if (session) { //só adiciona se não existir
            if (session.state != "CLOSED") {
                if (session.client)
                    await session.client.then(async client => {
                        try {
                            await client.close();
                        } catch (error) {
                            console.log("client.close(): " + error.message);
                        }
                        session.state = "CLOSED";
                        session.client = false;
                        console.log("client.close - session.state: " + session.state);
                    });
                return { result: "success", message: "CLOSED" };
            } else { //close
                return { result: "success", message: session.state };
            }
        } else {
            return { result: "error", message: "NOTFOUND" };
        }
    } //close

    static getSession(sessionName) {
        var foundSession = false;
        if (Sessions.sessions)
            Sessions.sessions.forEach(session => {
                if (sessionName == session.name) {
                    foundSession = session;
                }
            });
        return foundSession;
    } //getSession

    static getSessions() {
        if (Sessions.sessions) {
            return Sessions.sessions;
        } else {
            return [];
        }
    } //getSessions

    static async getQrcode(sessionName) {
        var session = Sessions.getSession(sessionName);
        if (session) {
            //if (["UNPAIRED", "UNPAIRED_IDLE"].includes(session.state)) {
            if (["UNPAIRED_IDLE"].includes(session.state)) {
                //restart session
                await Sessions.closeSession(sessionName);
                Sessions.start(sessionName);
                return { result: "error", message: session.state };
            } else if (["CLOSED"].includes(session.state)) {
                Sessions.start(sessionName);
                return { result: "error", message: session.state };
            } else { //CONNECTED
                if (session.status != 'isLogged') {
                    return { result: "success", message: session.state, qrcode: session.qrcode };
                } else {
                    return { result: "success", message: session.state };
                }
            }
        } else {
            return { result: "error", message: "NOTFOUND" };
        }
    } //getQrcode

    static async sendText(sessionName, number, text) {
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultSendText = await session.client.then(async client => {
                    return await client.sendText(number + '@c.us', text);
                });
                return { result: "success" }
            } else {
                return { result: "error", message: session.state };
            }
        } else {
            return { result: "error", message: "NOTFOUND" };
        }
    } //message

    static async sendFile(sessionName, number, base64Data, fileName, caption) {
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultSendFile = await session.client.then(async (client) => {
                    var folderName = fs.mkdtempSync(path.join(os.tmpdir(), session.name + '-'));
                    var filePath = path.join(folderName, fileName);
                    fs.writeFileSync(filePath, base64Data, 'base64');
                    console.log(filePath);
                    return await client.sendFile(number + '@c.us', filePath, fileName, caption);
                }); //client.then(
                return { result: "success" };
            } else {
                return { result: "error", message: session.state };
            }
        } else {
            return { result: "error", message: "NOTFOUND" };
        }
    } //message
}