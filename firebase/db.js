/*##############################################################################
# File: db.js                                                                  #
# Project: MyZap2.0                                                            #
# Created Date: 2021-06-21 14:12:20                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2021-06-21 18:27:30                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/


import config from "../config.js";
import { initializeApp } from 'firebase/app';
import { deleteDoc, 
    getFirestore, 
    collection, 
    getDocs, 
    setDoc, 
    doc, 
    getDoc, 
    addDoc 
} from 'firebase/firestore/lite';

const app = initializeApp(config.firebaseConfig);
const db = getFirestore(app);

const Sessions = await collection(db, 'Sessions');
const snapshot = await getDocs(Sessions);

export {snapshot};
export {addDoc};
export {setDoc};
export {getDoc};
export {doc};
export {db};
export {deleteDoc};
export {Sessions};
export default{ app };