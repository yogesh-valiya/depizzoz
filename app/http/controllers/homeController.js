const Menu = require('../../models/menu')

module.exports = () => {
    return {
        index(req, res) {
            Menu.find().then((pizzas) => {
                return res.render("home", {pizzas: pizzas})
            })
        }
    }
}