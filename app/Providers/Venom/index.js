'use strict'

const venom = require('venom-bot');

//const BeeQueue = require('bee-queue')

class Venom {
    constructor(Config) {
        this.Config = Config
        this._sessions = {};
        //this._queuesPool = {}
    }

    /*
    start(client) {
        client.onMessage((message) => {
            if (message.body === 'Hi') {
                client.sendText(message.from, 'Welcome Venom 🕷');
            }
        });
    }
    */

    get(name) {
        /**
         * If there is an instance of queue already, then return it
         */
        if (this._sessions[name]) {
            return this._sessions[name]
        }

        /**
         * Read configuration using Config
         * provider
         */
        const config = this.Config.get(`queue.${name}`)

        /**
         * Create a new queue instance and save it's
         * reference
         */
        //this._sessions[name] = new BeeQueue(name, config)
        this._sessions[name] = venom.create(name);//.then((client) => this.start(client));

        /**
         * Return the instance back
         */
        return this._sessions[name];
    }
}

module.exports = Venom