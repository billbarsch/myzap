/*
 * @Author: Eduardo Policarpo
 * @contact: +55 43996611437
 * @Date: 2021-05-10 18:09:49
 * @LastEditTime: 2021-06-07 03:18:01
 */
import Sessions from '../controllers/sessions.js';
import config from '../config.js';

const checkNumber = async (req, res, next) => {
    const c = '@c.us'
    let number = req.body.number
    let session = req.body.session
    let data = Sessions.getSession(session)

    let isGroup = req.body.isGroup
    if (isGroup === true) {
        next();
    }
    else {
        if (config.engine === '1') {
            if (!number) {
                return res.status(401).send({ message: "Telefone não informado." });
            }
            else {
                let profile = await data?.client?.isRegisteredUser(`${req?.body?.number}c`)
                if (!profile) {
                    return res.status(400).json({
                        response: false,
                        status: "error",
                        message: 'O telefone informado nao esta registrado no whatsapp.'
                    })
                } else {
                    next();
                }
            }
        } else {
            if (!number) {
                return res.status(401).send({ message: "Telefone não informado." });
            }
            else {
                let profile = await data.client.checkNumberStatus(req.body.number + c)
                if (!profile.numberExists) {
                    return res.status(400).json({
                        response: false,
                        status: "error",
                        message: 'O telefone informado nao esta registrado no whatsapp.'
                    })
                } else {
                    next();
                }
            }
        }
    }
}

export { checkNumber }
