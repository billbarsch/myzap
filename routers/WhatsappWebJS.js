/*
 * @Author: Eduardo Policarpo
 * @contact: +55 43996611437
 * @Date: 2021-05-10 18:09:49
 * @LastEditTime: 2021-06-07 03:18:01
 */
import express from'express';
const Router =  express.Router();
import engine from'../engines/WhatsappWebJS.js';
import Sessions from'../controllers/sessions.js';
import Mensagens from'../functions/WhatsappWebJS/mensagens.js';
import Status from'../functions/WhatsappWebJS/status.js';
import Auth from'../functions/WPPConnect/auth.js';
import config from'../config.js';
import { checkParams } from'../middlewares/validations.js';
import { checkNumber } from'../middlewares/checkNumber.js';
import {snapshot, setDoc, doc, db} from'../firebase/db.js';
import database from'../firebase/functions.js';

Router.post('/start', async (req, res) => {
    try {
        if (config.firebaseConfig.apiKey == '' &&
            config.firebaseConfig.authDomain == '' &&
            config.firebaseConfig.projectId == '' &&
            config.firebaseConfig.storageBucket == '' &&
            config.firebaseConfig.messagingSenderId == '' &&
            config.firebaseConfig.appId == '') {
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
                            'engine': process.env.ENGINE

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
})

// Sessões 
Router.post('/logout', checkParams, Auth.logoutSession);
Router.post('/close', checkParams, Auth.closeSession);
Router.post('/SessionState', checkParams, Auth.getSessionState);
Router.post('/SessionConnect', checkParams, Auth.checkConnectionSession);
Router.post('/deleteSession', database.deleteSession);
Router.post('/getAllSessions', database.getAllSessions);
Router.get('/getQrCode', Auth.getQrCode);

// Mensagens
Router.post('/sendText', checkParams, checkNumber, Mensagens.sendText);
Router.post('/sendImage', checkNumber, Mensagens.sendImage);
Router.post('/sendVideo', checkNumber, Mensagens.sendVideo);
Router.post('/sendSticker', checkNumber, Mensagens.sendSticker);
Router.post('/sendFile', checkNumber, Mensagens.sendFile);
// Router.post('/sendFile64', Mensagens.sendFile64);
Router.post('/sendAudio', Mensagens.sendAudio);
// Router.post('/sendVoiceBase64', Mensagens.sendVoiceBase64);
Router.post('/sendLink', checkNumber, Mensagens.sendLink);
Router.post('/sendContact', checkNumber, Mensagens.sendContact);
Router.post('/sendLocation', checkNumber, Mensagens.sendLocation);

// // Grupos
// Router.post('/getAllGroups', Groups.getAllGroups);
// Router.post('/joinGroup', Groups.joinGroup);
// Router.post('/createGroup', Groups.createGroup);
// Router.post('/leaveGroup', Groups.leaveGroup);
// Router.post('/getGroupMembers', Groups.getGroupMembers);
// Router.post('/addParticipant', Groups.addParticipant);
// Router.post('/removeParticipant', Groups.removeParticipant);
// Router.post('/promoteParticipant', Groups.promoteParticipant);
// Router.post('/demoteParticipant', Groups.demoteParticipant);
// Router.post('/getGroupAdmins', Groups.getGroupAdmins);
// Router.post('/getGroupInviteLink', Groups.getGroupInviteLink);
// Router.post('/setGroupPic', Groups.setGroupPic);

// // Status
Router.post('/sendTextToStorie', Status.sendTextToStorie);
//Router.post('/sendImageToStorie', Status.sendImageToStorie);
//Router.post('/sendVideoToStorie', Status.sendVideoToStorie);

// // Dispositivo, chats entre outras
// Router.post('/getBatteryLevel', Commands.getBatteryLevel);
// Router.post('/getConnectionState', Commands.getConnectionState);
// Router.post('/getHostDevice', Commands.getHostDevice);
// Router.post('/getAllContacts', Commands.getAllContacts);
// Router.post('/getBlockList', Commands.getBlockList);
// Router.post('/getMessagesChat', Commands.getMessagesChat);
// Router.post('/getProfilePic', Commands.getProfilePic);
// Router.post('/verifyNumber', Commands.verifyNumber);
// Router.post('/deleteChat', Commands.deleteChat);
// Router.post('/clearChat', Commands.clearChat);
// Router.post('/archiveChat', Commands.archiveChat);
// Router.post('/deleteMessage', Commands.deleteMessage);
// Router.post('/reply', Commands.reply);
// Router.post('/forwardMessages', Commands.forwardMessages);
// Router.post('/markUnseenMessage', Commands.markUnseenMessage);
// Router.post('/blockContact', Commands.blockContact);
// Router.post('/unblockContact', Commands.unblockContact);
// Router.post('/getNumberProfile', Commands.getNumberProfile);

export default {Router};