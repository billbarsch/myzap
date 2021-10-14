/*
 * @Author: Eduardo Policarpo
 * @contact: +55 43996611437
 * @Date: 2021-05-10 18:09:49
 * @LastEditTime: 2021-06-07 03:18:01
 */
import Sessions from '../../controllers/sessions.js';
import config from '../../config.js';
import engine from'../../engines/Venom.js';
import { setDoc, db, doc } from '../../firebase/db.js';


export default class Auth {





    static async start(req, res) {
        try {
    
            if (Object.keys(config.firebaseConfig).length === 0) {
                res.status(401).json({
                    result: 401,
                    "status": "FAIL",
                    "reason": "favor preencher as credencias de acesso ao Firebase"
                })
    
            } else {

                if (req.headers['apitoken'] === config.token) {
                    let session = req.body.session
                    let existSession = Sessions.checkSession(session)
                    if (!existSession) {
                        init(session)
                    }
                    if (existSession) {
                        let data = Sessions.getSession(session)
                        if (data.status !== 'inChat' && data.status !== 'isLogged') {
                            init(session)
                        }
                        else {
                            res.status(400).json({
                                result: 400,
                                "status": "FAIL",
                                "reason": "there is already a session with that name",
                                "status": data.status
                            })
                        }
                    }
    
                    async function init(session) {
                        Sessions.checkAddUser(session)
                        Sessions.addInfoSession(session, {
                            apitoken: req.headers['apitoken'],
                            sessionkey: req.headers['sessionkey'],
                            wh_status: req.body.wh_status,
                            wh_message: req.body.wh_message,
                            wh_qrcode: req.body.wh_qrcode,
                            wh_connect: req.body.wh_connect,
                            wa_browser_id: req.headers['wa_browser_id'] ? req.headers['wa_browser_id'] : '',
                            wa_secret_bundle: req.headers['wa_secret_bundle'] ? req.headers['wa_secret_bundle'] : '',
                            wa_token_1: req.headers['wa_token_1'] ? req.headers['wa_token_1'] : '',
                            wa_token_2: req.headers['wa_token_2'] ? req.headers['wa_token_2'] : '',
                        })
    
                        let response = await engine.start(req, res, session)
                        if (response != undefined) {
                            let data = {
                                'session': session,
                                'apitoken': req.headers['apitoken'],
                                'sessionkey': req.headers['sessionkey'],
                                'wh_status': req.body.wh_status,
                                'wh_message': req.body.wh_message,
                                'wh_qrcode': req.body.wh_qrcode,
                                'wh_connect': req.body.wh_connect,
                                'WABrowserId': response.WABrowserId,
                                'WASecretBundle': response.WASecretBundle,
                                'WAToken1': response.WAToken1,
                                'WAToken2': response.WAToken2,
                                'Engine': process.env.ENGINE
                            }
    
                            await setDoc(doc(db, "Sessions", session), data);
                            res.status(200).json({
                                "result": 200,
                                "status": "CONNECTED",
                                "response": `Sessão ${session} gravada com sucesso no Firebase`
                            })
    
                        }
                    }
                }
                else {
                    req.io.emit('msg', {
                        result: 400,
                        "status": "FAIL",
                        "reason": "Unauthorized, please check the API TOKEN"
                    })
                    res.status(401).json({
                        result: 401,
                        "status": "FAIL",
                        "reason": "Unauthorized, please check the API TOKEN"
                    })
                }
            }
    
        } catch (error) {
            res.status(500).json({
                result: 500,
                "status": "FAIL",
                "reason": error.message
            })
        }
    }




    static async logoutSession(req, res) {
        let data = Sessions.getSession(req.body.session)
        try {
            await data.client.logout();
            res.status(200).json({
                status: true,
                message: "Sessão Fechada com sucesso"
            });
        } catch (error) {
            res.status(400).json({
                status: false,
                message: "Error ao fechar sessão", error
            });
        }
    }



    static async closeSession(req, res) {
        let session = req.body.session;
        let data = Sessions.getSession(session)
        try {
            await data.client.close();
            res.status(200).json({
                status: true,
                message: "Sessão Fechada com sucesso"
            });
        } catch (error) {
            res.status(400).json({
                status: false,
                message: "Error ao fechar sessão", error
            });
        }
    }

    static async getQrCode(req, res) {
        let session = req.query.session;
        let sessionkey = req.query.sessionkey;
        let data = Sessions.getSession(session)
        if (!session) {
            return res.status(401).json({
                "result": 401,
                "messages": "Não autorizado, verifique se o nome da sessão esta correto"
            })
        }
        else
            if (data.sessionkey != sessionkey) {
                return res.status(401).json({
                    "result": 401,
                    "messages": "Não autorizado, verifique se o sessionkey esta correto"
                })
            }
            else {
                try {
                    var img = Buffer.from(data.qrCode.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''), 'base64');
                    res.writeHead(200, {
                        'Content-Type': 'image/png',
                        'Content-Length': img.length
                    });
                    res.end(img);
                } catch (ex) {
                    return res.status(400).json({
                        response: false,
                        message: "Error ao recuperar QRCode !"
                    });
                }
            }

    }
    static async getSessionState(req, res) {
        let data = Sessions.getSession(req.body.session)
        try {
            const client = data.client
            if (client == null || data.status == null)
                return res.status(200).json({
                    status: 'CLOSED',
                    qrcode: null
                });
            return res.status(200).json({
                status: data.status
            });
        } catch (ex) {
            return res.status(400).json({
                response: false,
                message: "A sessão não está ativa."
            });
        }
    }

    static async checkConnectionSession(req, res) {
        let data = Sessions.getSession(req.body.session)
        try {
            await data.client.isConnected();
            return res.status(200).json({
                status: true,
                message: "Connected"
            });
        } catch (error) {
            return res.status(200).json({
                status: false,
                message: "Disconnected"
            });
        }
    }
    static async showAllSessions(req, res) {
        // let data = Sessions.getAll();
        // const allSessions = data.forEach(element => {
        //     return ({ session: element.session, status: element.status })

        // });
        // console.log(allSessions);
        // return res.status(200).json(allSessions);

        //res.status(200).json({ sessions: Sessions.getAll() })

        // const allSessions = await clientsArray.map((client) => {
        //     console.log(client);
        //     return client.session;
        // });

        // console.log(allSessions);
        // return res.status(200).json(allSessions);
    }
}

