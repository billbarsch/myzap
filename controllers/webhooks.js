/*
 * @Author: Eduardo Policarpo
 * @contact: +55 43996611437
 * @Date: 2021-05-10 18:09:49
 * @LastEditTime: 2021-06-07 03:18:01
 */
import Sessions from '../controllers/sessions.js';
import superagent  from 'superagent';
import 'superagent-queue';
import dotenv from 'dotenv'
dotenv.config();
//require('superagent-queue');
//require('dotenv').config();

export default class Webhooks {

    static async wh_messages(session, response) {
        let data = Sessions.getSession(session)
        try {
            if (data.wh_message != undefined) {
                await superagent
                    .post(data.wh_message)
                    .send(response)
                    .queue('messages')
                    .end(function () {
                        console.log('webhooks receive message....')
                    });
                if (data.wh_message == '') {
                    console.log('Webhook no defined')
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    static async wh_connect(session, response, number = null, browserless = null, tokens = []) {
        let data = Sessions.getSession(session)
        if (response == 'autocloseCalled' || response == 'desconnectedMobile') {
            Sessions.deleteSession(session)
        }
        try {
            if (response == 'qrReadSuccess' || response == 'connected') {
                var object = {
                    "wook": 'STATUS_CONNECT',
                    'result': 200,
                    'session': session,
                    'status': response,
                    'number': number,
                    'browserless': browserless,
                    'tokens': tokens
                }
            } else {

                var object = {
                    "wook": 'STATUS_CONNECT',
                    'result': 200,
                    'session': session,
                    'status': response
                }
            }
            if (data.wh_connect != undefined) {
                await superagent
                    .post(data.wh_connect)
                    .send(object)
                    .queue('connection')
                    .end(function () {
                        console.log('webhooks connect status....')
                    });
                if (data.wh_connect == '') {
                    console.log('Webhook no defined')
                }
            }

        } catch (error) {
            console.log(error)
        }

    }

    static async wh_status(session, response) {
        let data = Sessions.getSession(session)
        try {
            if (data.wh_status != undefined) {
                await superagent
                    .post(data.wh_status)
                    .send(response)
                    .queue('status')
                    .end(function () {
                        console.log('webhooks status message....')
                    });
                if (data.wh_status == '') {
                    console.log('Webhook no defined')
                }
            }

        } catch (error) {
            console.log(error)
        }
    }

    static async wh_qrcode(session, response) {
        let data = Sessions.getSession(session)
        try {
            let object = {
                "wook": 'QRCODE',
                'result': 200,
                'session': session,
                'qrcode': response
            }
            if (data.wh_qrcode != undefined) {
                await superagent
                    .post(data.wh_qrcode)
                    .send(object)
                    .queue('qrcode')
                    .end(function () {
                        console.log('webhooks status message....')
                    });
                if (data.wh_qrcode == '') {
                    console.log('Webhook no defined')
                }
            }

        } catch (error) {
            console.log(error)
        }
    }
}