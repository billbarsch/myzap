/*##############################################################################
# File: startup.js                                                             #
# Project: myzap2.0                                                            #
# Created Date: 2021-06-27 02:34:00                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2021-07-11 00:35:56                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

import SessionsDB from "./firebase/model.js";
import { snapshot} from './firebase/db.js';
import request from "request-promise";
import config from "./config.js";

async function getAllSessions() {
    try {
        const SessionsArray = [];
        if (snapshot.empty) {
            return null;
        } else {
            snapshot.forEach(doc => {
                const Session = new SessionsDB(
                    doc.id,
                    doc.data().session,
                    doc.data().apitoken,
                    doc.data().sessionkey,
                    doc.data().wh_status,
                    doc.data().wh_message,
                    doc.data().wh_qrcode,
                    doc.data().wh_connect,
                    doc.data().WABrowserId,
                    doc.data().WASecretBundle,
                    doc.data().WAToken1,
                    doc.data().WAToken2,
                    doc.data().Engine
                );
                SessionsArray.push(Session);
            });
            return (SessionsArray);
        }
    } catch (error) {
        return (error.message);
    }
}

async function startAllSessions() {
    let dados = await getAllSessions()
    if (dados != null) {
        if (dados === 'Missing or insufficient permissions.') {
            console.log('######### ERRO DE CONFIGURACAO NO FIREBASE #########')
            console.log('####### Missing or insufficient permissions. #######')
            console.log('### Verifique as permissões de escrita e leitura ###')
        } else {
            dados.map((item) => {
                var options = {
                    'method': 'POST',
                    'json': true,
                    'url': `${config.host}:${config.port}/start`,
                    'headers': {
                        'apitoken': item.apitoken,
                        'sessionkey': item.sessionkey
                    },
                    body: {
                        "session": item.session,
                        "wh_connect": item.wh_connect,
                        "wh_qrcode": item.wh_qrcode,
                        "wh_status": item.wh_status,
                        "wh_message": item.wh_message
                    }

                };
                request(options).then(result => {
                    console.log(result)
                }).catch(error => {
                    console.log(error)
                })
            });

        }
    }
}
export default { startAllSessions };
