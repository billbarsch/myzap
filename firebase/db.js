/*##############################################################################
# File: db.js                                                                  #
# Project: MyZap2.0                                                            #
# Created Date: 2021-06-21 14:12:20                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2021-06-21 18:27:30                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

const firebase = require('firebase');
const config = require('../config');

const db = firebase.initializeApp(config.firebaseConfig);

module.exports = db;