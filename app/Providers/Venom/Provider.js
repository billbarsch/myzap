const { ServiceProvider } = require('@adonisjs/fold')

class VenomProvider extends ServiceProvider {
    register() {
        this.app.singleton('Vemon', () => {
            const Config = this.app.use('Adonis/Src/Config')
            return new (require('.'))(Config)
        })
    }
}

module.exports = VenomProvider