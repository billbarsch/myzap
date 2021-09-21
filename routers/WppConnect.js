/*
 * @Author: Eduardo Policarpo
 * @contact: +55 43996611437
 * @Date: 2021-05-10 18:09:49
 * @LastEditTime: 2021-06-07 03:18:01
 */
const express = require('express');
const Router = express.Router();
const engine = require('../engines/WppConnect');
const Sessions = require('../controllers/sessions');
const Status = require('../functions/WPPConnect/status');
const Commands = require('../functions/WPPConnect/commands');
const Groups = require('../functions/WPPConnect/groups');
const Mensagens = require('../functions/WPPConnect/mensagens');
const Auth = require('../functions/WPPConnect/auth');
const config = require('../config');
const { checkParams } = require('../middlewares/validations');
const { checkNumber } = require('../middlewares/checkNumber');
const database = require('../firebase/functions');
const firebase = require('../firebase/db');
const firestore = firebase.firestore();

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
                            'WAToken2': response.WAToken2
                        }

                        await firestore.collection('Sessions').doc(session).set(data);

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
Router.post('/sendImage', checkParams, checkNumber, Mensagens.sendImage);
Router.post('/sendVideo', checkParams, checkNumber, Mensagens.sendVideo);
Router.post('/sendSticker', checkParams, checkNumber, Mensagens.sendSticker);
Router.post('/sendFile', checkParams, checkNumber, Mensagens.sendFile);
Router.post('/sendFile64', checkParams, checkNumber, Mensagens.sendFile64);
Router.post('/sendAudio', checkParams, checkNumber, Mensagens.sendAudio);
Router.post('/sendAudio64', checkParams, checkNumber, Mensagens.sendVoiceBase64);
Router.post('/sendLink', checkParams, checkNumber, Mensagens.sendLink);
Router.post('/sendContact', checkParams, checkNumber, Mensagens.sendContact);
Router.post('/sendLocation', checkParams, checkNumber, Mensagens.sendLocation);
Router.post('/reply', checkParams, Mensagens.reply);
Router.post('/forwardMessages', checkParams, Mensagens.forwardMessages);
Router.post('/getMessagesChat', checkParams, checkNumber, Commands.getMessagesChat);
Router.post('/getAllChats', checkParams, Commands.getAllChats);
Router.post('/getAllChatsWithMessages', checkParams, Commands.getAllChatsWithMessages);
Router.post('/getAllNewMessages', checkParams, Commands.getAllNewMessages);
Router.post('/getAllUnreadMessages', checkParams, Commands.getAllUnreadMessages);
Router.post('/getOrderbyMsg', checkParams, Mensagens.getOrderbyMsg);

// // Grupos
Router.post('/getAllGroups', checkParams, Groups.getAllGroups);
Router.post('/joinGroup', checkParams, Groups.joinGroup);
Router.post('/createGroup', checkParams, Groups.createGroup);
Router.post('/leaveGroup', checkParams, Groups.leaveGroup);
Router.post('/getGroupMembers', checkParams, checkNumber, Groups.getGroupMembers);
Router.post('/addParticipant', checkParams, checkNumber, Groups.addParticipant);
Router.post('/removeParticipant', checkParams, checkNumber, Groups.removeParticipant);
Router.post('/promoteParticipant', checkParams, checkNumber, Groups.promoteParticipant);
Router.post('/demoteParticipant', checkParams, checkNumber, Groups.demoteParticipant);
Router.post('/getGroupAdmins', checkParams, Groups.getGroupAdmins);
Router.post('/changePrivacyGroup', checkParams, Groups.changePrivacyGroup); //nova
Router.post('/getGroupInviteLink', checkParams, Groups.getGroupInviteLink);
Router.post('/setGroupPic', checkParams, Groups.setGroupPic); // ver funcao nao exite

// // Status
Router.post('/sendTextToStorie', checkParams, Status.sendTextToStorie);
Router.post('/sendImageToStorie', checkParams, Status.sendImageToStorie);
Router.post('/sendVideoToStorie', checkParams, Status.sendVideoToStorie);

// // Dispositivo, chats entre outras
Router.post('/getBatteryLevel', checkParams, Commands.getBatteryLevel);
Router.post('/getConnectionState', checkParams, Commands.getConnectionState);
Router.post('/getHostDevice', checkParams, Commands.getHostDevice);
Router.post('/getAllContacts', checkParams, Commands.getAllContacts);
Router.post('/getBlockList', checkParams, Commands.getBlockList);

Router.post('/getProfilePic', checkParams, checkNumber, Commands.getProfilePic);
Router.post('/verifyNumber', checkParams, checkNumber, Commands.verifyNumber);
Router.post('/deleteChat', checkParams, checkNumber, Commands.deleteChat);
Router.post('/clearChat', checkParams, checkNumber, Commands.clearChat);
Router.post('/archiveChat', checkParams, checkNumber, Commands.archiveChat);
Router.post('/deleteMessage', checkParams, checkNumber, Commands.deleteMessage);

Router.post('/markUnseenMessage', checkParams, checkNumber, Commands.markUnseenMessage);
Router.post('/blockContact', checkParams, checkNumber, Commands.blockContact);
Router.post('/unblockContact', checkParams, checkNumber, Commands.unblockContact);
Router.post('/getNumberProfile', checkParams, checkNumber, Commands.getNumberProfile);


module.exports = Router;