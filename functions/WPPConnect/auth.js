/*
 * @Author: Eduardo Policarpo
 * @contact: +55 43996611437
 * @Date: 2021-05-10 18:09:49
 * @LastEditTime: 2021-06-07 03:18:01
 */
const Sessions = require('../../controllers/sessions');

module.exports = class Auth {

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

