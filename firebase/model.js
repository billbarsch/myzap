/*##############################################################################
# File: model.js                                                               #
# Project: myzap2.0                                                            #
# Created Date: 2021-06-21 18:29:14                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2021-06-27 02:56:04                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

export default class Sessions {
    constructor(id, session, apitoken, sessionkey, wh_status,
        wh_message, wh_qrcode, wh_connect, WABrowserId, WASecretBundle, WAToken1, WAToken2, Engine) {
        this.id = id;
        this.session = session;
        this.apitoken = apitoken;
        this.sessionkey = sessionkey;
        this.wh_status = wh_status;
        this.wh_message = wh_message;
        this.wh_qrcode = wh_qrcode;
        this.wh_connect = wh_connect;
        this.WABrowserId = WABrowserId;
        this.WASecretBundle = WASecretBundle;
        this.WAToken1 = WAToken1;
        this.WAToken2 = WAToken2;
        this.Engine = Engine;
    }
}

