var express = require("express");
var venom = require('venom-bot');

//const client = venom.create().then((client) => start(client));
venom.create().then((client) => start(client));

function start(client) {

    var app = express();
    app.listen(3333, () => {
        console.log("Server running on port 3333");
    });

    app.get("/message", async (req, res, next) => {
        let messageResult = client.sendMessage(req.query.number + '@c.us', req.query.message);
        //let chats = await client.getAllGroups();
        res.json(messageResult);
    });

    client.onMessage((message) => {
        if (message.body === 'Hi') {
            client.sendText(message.from, 'Welcome Venom 🕷');
        }
    });
}