/*
 * @Author: Eduardo Policarpo
 * @contact: +55 43996611437
 * @Date: 2021-05-10 18:09:49
 * @LastEditTime: 2021-06-07 03:18:01
 */
import { doc, db, getDoc } from '../firebase/db.js';
import { Client } from "whatsapp-web.js";
import qrcode from'qrcode-terminal';
import qrcodeBase64 from'qrcode';
import { Launcher } from'chrome-launcher';
let chromeLauncher = Launcher.getInstallations()[0];
import Sessions from'../controllers/sessions.js';
import events from'../controllers/events.js';
import webhooks from'../controllers/webhooks.js';
import config from'../config.js';

export default class WhatsappWebJS {
    static async start(req, res, session) {
        return new Promise(async (resolve, reject) => {
            try {
                var useHere;
                if (config.useHere === 'true') {
                    useHere = false
                }
                else {
                    if (config.useHere != 'true') {
                        useHere = true
                    }
                }
                console.log(useHere)
                let client;

                const Session = doc(db, "Sessions", session);
                const dados = await getDoc(Session);
                if (dados.exists() && dados.data().engine === process.env.ENGINE) {
                    console.log(`****** STARTING SESSION ${session} ******`)
                    client = new Client({
                        restartOnAuthFail: true,
                        takeoverOnConflict: useHere,
                        puppeteer: {
                            headless: false,
                            args: [
                                '--no-sandbox',
                                '--disable-setuid-sandbox',
                                '--disable-dev-shm-usage',
                                '--disable-accelerated-2d-canvas',
                                '--no-first-run',
                                '--no-zygote',
                                '--single-process',
                                '--disable-gpu'
                            ],
                        },
                        session: {
                            WABrowserId: dados.data().WABrowserId,
                            WASecretBundle: dados.data().WASecretBundle,
                            WAToken1: dados.data().WAToken1,
                            WAToken2: dados.data().WAToken2,
                            engine: process.env.ENGINE
                        }
                    });

                    client.on('ready', () => {
                        req.io.emit('whatsapp-status', true);
                        console.log('READY... WhatsApp is ready');
                    });
                    client.on('auth_failure', () => {
                        console.log('Auth failure, restarting...');
                    })
                    client.initialize();
                    Sessions.addInfoSession(session, {
                        session: session,
                        client: client
                    })

                } else {
                    console.log(`****** STARTING SESSION ${session} ******`)
                    client = new Client({
                        restartOnAuthFail: true,
                        takeoverOnConflict: useHere,
                        puppeteer: {
                            headless: false,
                            args: [
                                '--no-sandbox',
                                '--disable-setuid-sandbox',
                                '--disable-dev-shm-usage',
                                '--disable-accelerated-2d-canvas',
                                '--no-first-run',
                                '--no-zygote',
                                '--single-process',
                                '--disable-gpu'
                            ],
                        }
                    });
                    client.on('qr', (qr) => {
                        console.log('QR RECEIVED', qr);
                        qrcode.generate(qr, { small: true });
                        qrcodeBase64.toDataURL(qr, (err, url) => {
                            webhooks.wh_qrcode(session, url)
                            this.exportQR(req, res, url, session);
                            Sessions.addInfoSession(session, {
                                qrCode: url
                            })
                        });
                    });
                    client.on('ready', () => {
                        console.log('READY... WhatsApp is ready');
                    });
                    client.on('auth_failure', () => {
                        console.log('Auth failure, restarting...');
                    })
                    client.initialize();
                    Sessions.addInfoSession(session, {
                        session: session,
                        client: client
                    })
                }
                events.receiveMessage(session, client)
                events.statusMessage(session, client)

                client.on('authenticated', (session) => {
                    resolve(session)
                });
                client.on('change_state', (reason) => {
                    console.log('Client was change state', reason);
                    webhooks.wh_connect(session, reason)
                });

                client.on('disconnected', (reason) => {
                    console.log('Whatsapp is disconnected!');
                    client.destroy();
                    client.initialize();
                });

                client.on('change_battery', (batteryInfo) => {
                    const { battery, plugged } = batteryInfo;
                    console.log(`Battery: ${battery}% - Charging? ${plugged}`);
                });

                client.on('message', async message => {

                })

                client.on('message_received', async message => {

                })

                client.on('message_ack', (message, ack) => {

                });

                client.on('message_create', async (message) => {
                    // Disparado em todas as criações de mensagem, incluindo a sua 
                    if (!message.fromMe) {
                        // faça coisas aqui, pode ser disparado um webhook por exemplo
                    }
                });

                client.on('message_revoke_everyone', async (after, before) => {
                    // Disparado sempre que uma mensagem é excluída por alguém (incluindo você)
                    //console.log(after); // mensagem depois de ser excluída.
                    if (before) {
                        //console.log(before); // mensagem antes de ser excluída.
                    }
                });

                client.on('message_revoke_me', async (message) => {
                    // Disparado sempre que uma mensagem é excluída apenas em sua própria visualização.
                    //console.log(message.body); // mensagem antes de ser excluída.
                });

                client.on('media_uploaded', async (message) => {
                    //Disparado sempre quando a mídia foi carregada para uma mensagem enviada pelo cliente.
                });

                client.on('group_update', async (message) => {
                    //Disparado sempre quando as configurações do grupo são atualizadas, como assunto, descrição ou imagem.
                    //console.log(message)
                });

            } catch (error) {
                reject(error)
                console.log(error)
            }
        })
    }
    static async exportQR(req, res, qrCode, session) {
        qrCode = qrCode.replace('data:image/png;base64,', '');
        const imageBuffer = Buffer.from(qrCode, 'base64');
        req.io.emit('qrCode',
            {
                data: 'data:image/png;base64,' + imageBuffer.toString('base64'),
                session: session
            }
        );
    }
}