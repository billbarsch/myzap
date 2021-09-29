/*
 * @Author: Eduardo Policarpo
 * @contact: +55 43996611437
 * @Date: 2021-05-10 18:09:49
 * @LastEditTime: 2021-06-07 03:18:01
 */
import urlExists from "url-exists";
export default class Sessions {

    static session = new Array()
    static checkPath(path) {
        urlExists(path, (error, exists) => {
            if (exists) {
                return true
            }
            else {
                return false
            }
        })
    }
    // checar ou adiciona um usuario na sessão
    static checkAddUser(name) {
        var checkFilter = this.session.filter(order => (order.session === name)), add = null
        if (!checkFilter.length) {
            add = {
                session: name,
            }
            this.session.push(add)
            return true
        }
        return false
    }

    // checar se exite o usuario na sessão
    static checkSession(name) {
        var checkFilter = this.session.filter(order => (order.session === name))
        if (checkFilter.length) {
            return true
        }
        return false
    }

    // pegar index da sessão (chave)
    static getSessionKey(name) {
        if (this.checkSession(name)) {
            for (var i in this.session) {
                if (this.session[i].session === name) {
                    return i
                }
            }
        }
        return false
    }

    // adicionar informações a sessão 
    static addInfoSession(name, extend) {

        if (this.checkSession(name)) {
            for (var i in this.session) {
                if (this.session[i].session === name) {
                    Object.assign(this.session[i], extend)
                    return true
                }
            }
        }
        return false
    }

    // Remove object na sessão
    static removeInfoObjects(name, key) {
        if (this.checkSession(name)) {
            for (var i in this.session) {
                if (this.session[i].session === name) {
                    delete this.session[i][key]
                    return true
                }
            }
        }
        return false
    }

    // deletar sessão
    static deleteSession(name) {
        if (this.checkSession(name)) {
            var key = this.getSessionKey(name)
            delete this.session[key]
            return true
        }
        return false
    }

    // retornar sessão
    static getSession(name) {
        if (this.checkSession(name)) {
            var key = this.getSessionKey(name)
            return this.session[key]
        }
        return false
    }

    // retornar todas
    static getAll() {
        return this.session
    }

    // checa o client
    static checkClient(name) {
        if (this.getSession(name) && this.getSession(name).client) {
            return true
        }
        return false
    }

}