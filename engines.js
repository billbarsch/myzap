/*
 * @Author: Eduardo Policarpo
 * @contact: +55 43996611437
 * @Date: 2021-05-20 18:05:16
 * @LastEditTime: 2021-06-07 03:18:22
 */
var engines = {
    1: {
        descricao: "Engine Whatsapp-Web-JS",
        motor: require("./engines/WhatsappWebJS"),
        router: require("./routers/WhatsappWebJS"),
    },
    2: {
        descricao: "Engine WPPConnect",
        motor: require("./engines/WppConnect"),
        router: require("./routers/WppConnect"),
    },
    3: {
        descricao: "Engine Venom",
        motor: require("./engines/Venom"),
        router: require("./routers/Venom"),
    },
};

exports.engines = engines;