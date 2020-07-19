'use strict'

const Venom = use('Venom');

class MessageController {

    async store({ request, response }) {

        const data = request.only(['number', 'message']);
        resultado = Venom.get('sessao1').sendText(data.number + '@c.us', data.message);
        return resultado;
        //return response
        //    .status(200)
        //    .send({ message: { success: 'Tudo ok' } })
    }
}

module.exports = MessageController
