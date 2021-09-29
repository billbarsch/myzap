/*
 * @Author: Eduardo Policarpo
 * @contact: +55 43996611437
 * @Date: 2021-05-10 18:09:49
 * @LastEditTime: 2021-06-07 03:18:01
 */
import Sessions from '../../controllers/sessions.js';
import get from "async-get-file";
import path from 'path';
import fs from 'fs';
import util from 'util';
import urlExistsImpor from 'url-exists';
const urlExists = util.promisify(urlExistsImpor);

export default class Status {

    static async sendTextToStorie(req, res) {
        let data = Sessions.getSession(req.body.session)
        if (!req.body.text) {
            return res.status(400).json({
                status: 400,
                error: "Text não foi informado"
            })
        }
        else {
            await data.client.sendMessage('status@broadcast', req.body.text)
            return res.status(200).json({
                result: 200,
                status: 'SUCCESS',
            })
        }
    }

    static async sendImageToStorie(req, res) {
        if (!req.body.path) {
            return res.status(400).send({
                status: 400,
                error: "Path não informado",
                message: "Informe o path. Exemplo: C:\\folder\\video.jpg para arquivo local ou URL caso o arquivo a ser enviado esteja na internet"
            });
        }
        let data = Sessions.getSession(req.body.session)
        let isURL = await urlExists(req.body.path);
        let name = req.body.path.split(/[\/\\]/).pop();

        try {
            if (isURL) {
                let dir = 'files-received/'
                await get(req.body.path, {
                    directory: 'files-received'
                });
                const media = MessageMedia.fromFilePath(dir + name);
                let response = await data.client.sendMessage('status@broadcast', media, { caption: req.body.caption || "" });
                fs.unlink(path.basename("/files-received") + "/" + name, erro => console.log(""))
                return res.status(200).json({
                    result: 200,
                    type: 'image',
                    status: 'SUCCESS'
                })

            }
            if (!isURL) {
                const media = MessageMedia.fromFilePath(req.body.path);
                let response = await data.client.sendMessage('status@broadcast', media, { caption: req.body.caption || "" })

                return res.status(200).json({
                    result: 200,
                    type: 'image',
                    status: 'SUCCESS'
                })
            }

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }


    static async sendVideoToStorie(req, res) {
        if (!req.body.path) {
            return res.status(400).send({
                status: 400,
                error: "Path não informado",
                message: "Informe o path. Exemplo: C:\\folder\\video.mp4 para arquivo local ou URL caso o arquivo a ser enviado esteja na internet"
            });
        }
        let data = Sessions.getSession(req.body.session)
        let isURL = await urlExists(req.body.path);
        let name = req.body.path.split(/[\/\\]/).pop();

        try {
            if (isURL) {
                let dir = 'files-received/'
                await get(req.body.path, {
                    directory: 'files-received'
                });
                const media = MessageMedia.fromFilePath(dir + name);
                let response = await data.client.sendMessage('status@broadcast', media, { caption: req.body.caption || "" });
                fs.unlink(path.basename("/files-received") + "/" + name, erro => console.log(""))
                return res.status(200).json({
                    result: 200,
                    status: 'SUCCESS',
                })

            }
            if (!isURL) {
                const media = MessageMedia.fromFilePath(req.body.path);
                let response = await data.client.sendMessage('status@broadcast', media, { caption: req.body.caption || "" })

                return res.status(200).json({
                    result: 200,
                    status: 'SUCCESS',
                })
            }

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }
}