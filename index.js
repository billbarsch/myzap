var express = require("express");
var app = express();
app.listen(3333, () => {
    console.log("Server running on port 3333");
});

app.get("/message", (req, res, next) => {
    res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});