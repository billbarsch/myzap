
/**
  MyZAP2.0 API OpenSource
  @codigo escrito em 07/06/2021
  @Author Eduardo Policarpo
 */
import Sessions from '../../controllers/sessions.js';
import get from "async-get-file";
import path from 'path'
import fs from 'fs';
import whatsappweb from "whatsapp-web.js";
const { MessageMedia, Location, Contact } = whatsappweb;
import util from 'util';
import urlExistsImport from 'url-exists';
const urlExists = util.promisify(urlExistsImport);
import moment from 'moment';

const mediadownloader = (url, path, callback) => {
    request.head(url, (err, res, body) => {
        request(url)
            .pipe(fs.createWriteStream(path))
            .on('close', callback)
    })
}

export default class Mensagens {


    static async sendText(req, res) {
        let { session, number, text } = req.body
        let data = Sessions.getSession(session)
        let isGroup = req.body.isGroup;
        number = isGroup === true ? req.body.number + '@g.us' : req.body.number + '@c.us';

        if (!req.body.text) {
            return res.status(400).json({
                status: 400,
                error: "Text não foi informado"
            })
        }
        else {
            try {
                let response = await data.client.sendMessage(number, text)
                return res.status(200).json({
                    result: 200,
                    type: 'text',
                    id: response.id._serialized,
                    phone: response.to,
                    content: response.body,
                    //send: moment(response.timestamp).format('DD-MM-YYYY hh:mm:ss')
                });
            } catch (error) {
                res.status(500).json({
                    status: 'FAIL',
                    error: error
                });
            }
        }
    }



    static async addStatusText(req, res) {
        let { session, number, text } = req.body
        let data = Sessions.getSession(session)
        let response = await data.client.sendMessage('status@broadcast', text)
        return res.status(200).json({
            result: "success"
        })
    }

    static async sendImage(req, res) {
        if (!req.body.path) {
            return res.status(400).send({
                status: 400,
                error: "Path não informado",
                message: "Informe o path. Exemplo: C:\\folder\\video.jpg para arquivo local ou URL caso o arquivo a ser enviado esteja na internet"
            });
        }
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number + '@c.us';
        let isURL = await urlExists(req.body.path);
        let name = req.body.path.split(/[\/\\]/).pop();

        try {
            if (isURL) {
                let dir = 'files-received/'
                await get(req.body.path, {
                    directory: 'files-received'
                });
                const media = MessageMedia.fromFilePath(dir + name);
                let response = await data.client.sendMessage(number, media, { caption: req.body.caption || "" });
                fs.unlink(path.basename("/files-received") + "/" + name, erro => console.log(""))
                return res.status(200).json({
                    result: 200,
                    type: 'image',
                    id: response.id._serialized,
                    session: req.body.session,
                    phone: response.id.remote._serialized,
                    file: req.body.filePath,
                    content: response.body,
                    mimetype: response.type
                })

            }
            if (!isURL) {
                const media = MessageMedia.fromFilePath(req.body.path);
                let response = await data.client.sendMessage(number, media, { caption: req.body.caption || "" })

                return res.status(200).json({
                    result: 200,
                    type: 'image',
                    id: response.id._serialized,
                    session: req.body.session,
                    phone: response.id.remote._serialized,
                    file: req.body.filePath,
                    content: response.body,
                    mimetype: response.type
                })
            }

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }

    static async sendVideo(req, res) {
        if (!req.body.path) {
            return res.status(400).send({
                status: 400,
                error: "Path não informado",
                message: "Informe o path. Exemplo: C:\\folder\\video.mp4 para arquivo local ou URL caso o arquivo a ser enviado esteja na internet"
            });
        }
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number + '@c.us';
        let isURL = await urlExists(req.body.path);
        let name = req.body.path.split(/[\/\\]/).pop();

        try {
            if (isURL) {
                let dir = 'files-received/'
                await get(req.body.path, {
                    directory: 'files-received'
                });
                const media = MessageMedia.fromFilePath(dir + name);
                let response = await data.client.sendMessage(number, media, { caption: req.body.caption || "" });
                fs.unlink(path.basename("/files-received") + "/" + name, erro => console.log(""))
                return res.status(200).json({
                    result: 200,
                    type: 'video',
                    id: response.id._serialized,
                    session: req.body.session,
                    phone: response.id.remote._serialized,
                    file: req.body.filePath,
                    content: response.body,
                    mimetype: response.type
                })

            }
            if (!isURL) {
                const media = MessageMedia.fromFilePath(req.body.path);
                let response = await data.client.sendMessage(number, media, { caption: req.body.caption || "" })

                return res.status(200).json({
                    result: 200,
                    type: 'video',
                    id: response.id._serialized,
                    session: req.body.session,
                    phone: response.id.remote._serialized,
                    file: req.body.filePath,
                    content: response.body,
                    mimetype: response.type
                })
            }

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }

    static async sendSticker(req, res) {
        if (!req.body.path) {
            return res.status(400).send({
                status: 400,
                error: "Path não informado",
                message: "Informe o path. Exemplo: C:\\folder\\video.png para arquivo local ou URL caso o arquivo a ser enviado esteja na internet"
            });
        }
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number + '@c.us';
        let isURL = await urlExists(req.body.path);
        let name = req.body.path.split(/[\/\\]/).pop();

        try {
            if (isURL) {
                let dir = 'files-received/'
                await get(req.body.path, {
                    directory: 'files-received'
                });
                const media = MessageMedia.fromFilePath(dir + name);
                let response = await data.client.sendMessage(number, media, { sendMediaAsSticker: true });
                fs.unlink(path.basename("/files-received") + "/" + name, erro => console.log(""))
                return res.status(200).json({
                    result: 200,
                    type: 'sticker',
                    id: response.id._serialized,
                    session: req.body.session,
                    phone: response.id.remote._serialized,
                    file: req.body.filePath,
                    content: response.body,
                    mimetype: response.type
                })

            }
            if (!isURL) {
                const media = MessageMedia.fromFilePath(req.body.path);
                let response = await data.client.sendMessage(number, media, { sendMediaAsSticker: true })

                return res.status(200).json({
                    result: 200,
                    type: 'sticker',
                    id: response.id._serialized,
                    session: req.body.session,
                    phone: response.id.remote._serialized,
                    file: req.body.filePath,
                    content: response.body,
                    mimetype: response.type
                })
            }

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }

    static async sendFile(req, res) {
        if (!req.body.path) {
            return res.status(400).send({
                status: 400,
                error: "Path não informado",
                message: "Informe o path. Exemplo: C:\\folder\\arquivo.pfd para arquivo local ou URL caso o arquivo a ser enviado esteja na internet"
            });
        }
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number + '@c.us';
        let isURL = await urlExists(req.body.path);
        let name = req.body.path.split(/[\/\\]/).pop();

        try {
            if (isURL) {
                let dir = 'files-received/'
                await get(req.body.path, {
                    directory: 'files-received'
                });
                const media = MessageMedia.fromFilePath(dir + name);
                let response = await data.client.sendMessage(number, media, { caption: req.body.caption || "" });
                fs.unlink(path.basename("/files-received") + "/" + name, erro => console.log(""))
                return res.status(200).json({
                    result: 200,
                    type: 'file',
                    id: response.id._serialized,
                    session: req.body.session,
                    phone: response.id.remote._serialized,
                    file: req.body.filePath,
                    content: response.body,
                    mimetype: response.type
                })

            }
            if (!isURL) {
                const media = MessageMedia.fromFilePath(req.body.path);
                let response = await data.client.sendMessage(number, media, { caption: req.body.caption || "" })

                return res.status(200).json({
                    result: 200,
                    type: 'file',
                    id: response.id._serialized,
                    session: req.body.session,
                    phone: response.id.remote._serialized,
                    file: req.body.filePath,
                    content: response.body,
                    mimetype: response.type
                })
            }

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error
            })
        }
    }

    static async sendAudio(req, res) {
        if (!req.body.path) {
            return res.status(400).send({
                status: 400,
                error: "Path não informado",
                message: "Informe o path. Exemplo: C:\\folder\\arquivo.mp3 para arquivo local ou URL caso o arquivo a ser enviado esteja na internet"
            });
        }
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number + '@c.us';
        let isURL = await urlExists(req.body.path);

        if (isURL) {
            await get(req.body.path, {
                directory: 'files-received'
            });
            let file = req.body.path.split(/[\/\\]/).pop();
            let name = file.split('.')[0];
            let dir = 'files-received/'
            let ext = file.split('.').pop();

            if (ext === 'mp3' || ext === 'ogg' || ext === 'webm') {
                try {
                    const media = MessageMedia.fromFilePath(dir + name);
                    let response = await data.client.sendMessage(number, media, { sendAudioAsVoice: true })
                    fs.unlink(path.basename("/files-received") + "/" + name, erro => console.log(""))
                    return res.status(200).json({
                        result: 200,
                        type: 'audio',
                        id: response.id._serialized,
                        session: req.body.session,
                        phone: response.id.remote._serialized,
                        file: req.body.path,
                        content: response.body,
                        mimetype: response.type
                    })

                } catch (e) {
                    return res.status(400).json({
                        result: 400,
                        "status": "FAIL",
                        "log": e
                    })
                }
            }
            else {
                return res.status(400).json({
                    result: 400,
                    "status": "FAIL",
                    "log": 'Envio de áudio permitido apenas com arquivos .mp3 ou .ogg ou .webm'
                })
            }
        }
        if (!isURL) {
            let file = req.body.path.split(/[\/\\]/).pop();
            let ext = file.split('.').pop();
            if (ext === 'mp3' || ext === 'ogg' || ext === 'webm') {
                try {
                    const media = MessageMedia.fromFilePath(req.body.path);
                    let response = await data.client.sendMessage(number, media, { sendAudioAsVoice: true })
                    return res.status(200).json({
                        result: 200,
                        type: 'audio',
                        id: response.id._serialized,
                        session: req.body.session,
                        phone: response.id.remote._serialized,
                        file: req.body.path,
                        content: response.body,
                        mimetype: response.type
                    })

                } catch (e) {
                    return res.status(400).json({
                        result: 400,
                        "status": "FAIL",
                        "log": e
                    })
                }
            }
            else {
                return res.status(400).json({
                    result: 400,
                    "status": "FAIL",
                    "log": 'Envio de áudio permitido apenas com arquivos .mp3 ou .ogg ou .webm'
                })
            }
        }
    }

    static async sendLocation(req, res) {
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number + '@c.us';
        if (!req.body.lat) {
            return res.status(400).json({
                status: 400,
                error: "Latitude não foi informada"
            })
        }
        else if (!req.body.log) {
            return res.status(400).json({
                status: 400,
                error: "Longitude não foi informada"
            })
        }
        if (!req.body.title) {
            return res.status(400).json({
                status: 400,
                error: "Title do endereço não foi informado"
            })
        }
        else if (!req.body.description) {
            return res.status(400).json({
                status: 400,
                error: "Descrição do endereço não foi informado"
            })
        }
        else {
            try {
                const loc = new Location(req.body.lat, req.body.log, `${req.body.title}\n${req.body.description}`);

                let response = await data.client.sendMessage(number, loc)
                return res.status(200).json({
                    result: 200,
                    type: 'locate',
                    id: response.id._serialized,
                    session: req.body.session,
                    phone: response.id.remote._serialized,
                    mimetype: response.type

                })
            } catch (error) {
                return res.status(400).json({
                    result: 400,
                    "status": "FAIL",
                    "log": error
                })
            }
        }
    }

    static async sendContact(req, res) {
        let data = Sessions.getSession(req.body.session)
        let number = req.body.number + '@c.us';
        if (!req.body.contact) {
            return res.status(400).json({
                status: 400,
                error: "Contact não foi informado"
            })
        }
        else if (!req.body.name) {
            return res.status(400).json({
                status: 400,
                error: "Nome do Contato não foi informado"
            })
        }
        else {
            try {

                let response = await data.client.sendMessage(number, req.body.contact + '@c.us', { parseVCards: true })

                return res.status(200).json({
                    result: 200,
                    type: 'contact',
                    messageId: response.id,
                    session: req.body.session,
                    phone: response.to.user,
                    content: response.content
                })
            } catch (error) {
                return res.status(400).json({
                    result: 400,
                    "status": "FAIL",
                    "log": error
                })
            }
        }
    }

    static async sendLink(req, res) {
        let data = Sessions.getSession(req.body.session)
        let isGroup = req.body.isGroup;
        let number = isGroup === true ? req.body.number + '@g.us' : req.body.number + '@c.us';
        
        if (!req.body.url) {
            return res.status(400).json({
                status: 400,
                error: "URL não foi informada, é obrigatorio"
            })
        }
        else {
            try {
                let response = await data.client.sendMessage(number, req.body.url, req.body.text, { linkPreview: true })

                return res.status(200).json({
                    result: 200,
                    type: 'link',
                    messageId: response.id,
                    session: req.body.session,
                    phone: response.to.user,
                    content: response.content
                })
            } catch (error) {
                return res.status(400).json({
                    result: 400,
                    "status": "FAIL",
                    "log": error
                })
            }
        }
    }

    /** 
    Parei aqui, faltam
    @sendLink
    @sendContact
    @sendLocation
    Author: Eduardo Policarpo em 07/06/2021
    */

}

