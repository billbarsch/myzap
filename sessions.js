// person.js
'use strict';

const venom = require('venom-bot');
const { json } = require('express');

module.exports = class Sessions {

    static async start(sessionName) {
        Sessions.sessions = Sessions.sessions || []; //start array

        var jaExiste = false;
        Sessions.sessions.forEach(session => {
            if (session.name == sessionName) {
                jaExiste = true;
            }
        });

        if (!jaExiste) { //só adiciona se não existir
            var newSession = Sessions.sessions.push({
                name: sessionName,
                qrcode: '',
                status: 'notLogged'
            });
            newSession.client = Sessions.init(sessionName);
        } else {
            console.log(sessionName + " already exists");
        }
    }

    static async init(sessionName) {
        var session = Sessions.getSession(sessionName);
        const client = await venom.create(
            sessionName,
            (base64Qr) => {
                session.qrcode = base64Qr;
            },
            (statusFind) => {
                session.status = statusFind;
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
            }
        );//.then((client) => Sessions.startProcess(client));
        return client;
    }

    /*
    static startProcess(client) {

        console.log("new session " + client.name);

        /*
        //check messages
        setInterval((client, sessionName) => {
            console.log('check messages');
            var session = Sessions.getSession(sessionName);
            if (session.messages) {
                session.messages.forEach((message) => {
                    client.sendMessageToId(message.number + '@c.us', message.text);
                });//foreach messages
            }//if messages
        }, 1000);

        client.onMessage((message) => {
            if (message.body === 'Hi') {
                client.sendText(message.from, 'Welcome Venom 🕷');
            }
        });

    }
    */
    static getQrcode(sessionName) {
        var session = Sessions.getSession(sessionName);
        if (session.status != 'isLogged') {
            return session.qrcode;
        } else {
            return false;
        }
    } //getQrcode

    static getSession(sessionName) {
        var foundSession = false;
        if (Sessions.sessions)
            Sessions.sessions.forEach(session => {
                if (sessionName == session.name) {
                    foundSession = session;
                }
            });
        return foundSession;
    }//getSession

    static getSessions() {
        return Sessions.sessions;
    }//getSessions

    static message(sessionName, number, text) {
        var session = Sessions.getSession(sessionName);
        if (session) {
            session.client.then(async (client) => {
                await client.sendMessageToId(number + '@c.us', text);
            });
        }
    }
}
