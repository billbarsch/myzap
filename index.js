var express = require("express");
var venom = require('venom-bot');

var client = venom.create().then((client) => start(client));

function start(client) {
    client.onMessage((message) => {
        if (message.body === 'Hi') {
            client.sendText(message.from, 'Welcome Venom 🕷');
        }
    });
}

var app = express();
app.listen(3333, () => {
    console.log("Server running on port 3333");
});

app.get("/message", (req, res, next) => {
    res.json(req.query);
});