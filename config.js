/*##############################################################################
# File: config.js                                                              #
# Project: myzap2.0                                                            #
# Created Date: 2021-06-21 12:52:13                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2021-07-23 15:07:40                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

//'use strict';
import dotenv from "dotenv";
import assert from "assert";

dotenv.config();

const {
  PORT,
  HOST,
  TOKEN,
  HTTPS,
  DOMAIN_SSL,
  ENGINE,
  SSL_KEY_PATH,
  SSL_CERT_PATH,
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  START_ALL_SESSIONS,
  FORCE_CONNECTION_USE_HERE
} = process.env;

assert(PORT, 'PORT is required, please set the PORT variable value in the .env file');
assert(HOST, 'HOST is required, please set the HOST variable value in the .env file');
assert(TOKEN, 'TOKEN is required, please set the ENGINE variable value in the .env file');
assert(ENGINE, 'ENGINE is required, please set the ENGINE variable value in the .env file');


export default {
  port: PORT,
  host: HOST,
  token: TOKEN,
  https: HTTPS,
  host_ssl: DOMAIN_SSL,
  engine: ENGINE,
  ssl_key_path: SSL_KEY_PATH,
  ssl_cert_path: SSL_CERT_PATH,
  firebaseConfig: {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID
  },
  start_all_sessions: START_ALL_SESSIONS,
  useHere: FORCE_CONNECTION_USE_HERE,
}
