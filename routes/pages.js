const express = require("express");
const router = express.Router();
//
//
// ------------------------------------------------------------------------------------------------------- //
//
//
router.get("/home", async (req, res) => {
    res.render("pages/index");
});
//
//
router.get("/sendText", async (req, res) => {
    res.render("pages/sendText");
});
//
//
router.get("/sendTextMult", async (req, res) => {
    res.render("pages/sendTextMult");
});
//
//
// ------------------------------------------------------------------------------------------------------- //
//
//
module.exports = router;