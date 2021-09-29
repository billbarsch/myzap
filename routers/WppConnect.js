/*
 * @Author: Eduardo Policarpo
 * @contact: +55 43996611437
 * @Date: 2021-05-10 18:09:49
 * @LastEditTime: 2021-06-07 03:18:01
 */
import express from'express';
const Router = express.Router();
import engine from'../engines/WppConnect.js';
import Sessions from'../controllers/sessions.js';
import Status from'../functions/WPPConnect/status.js';
import Commands from'../functions/WPPConnect/commands.js';
import Groups from'../functions/WPPConnect/groups.js';
import Mensagens from'../functions/WPPConnect/mensagens.js';
import Auth from'../functions/WPPConnect/auth.js';
import config from'../config.js';
import { checkParams } from'../middlewares/validations.js';
import { checkNumber } from'../middlewares/checkNumber.js';
import database from'../firebase/functions.js';
import { setDoc, doc, db} from'../firebase/db.js';

Router.post('/start', Auth.start)
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


export default { Router };