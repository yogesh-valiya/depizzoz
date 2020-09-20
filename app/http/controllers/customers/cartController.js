module.exports = () => {
    return {
        index(req, res) {
            res.render("customer/cart")
        },
        update(req, res) {

            if(!req.session.cart){
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }

            let cart = req.session.cart

            if(!cart.items[req.body._id]){
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1
                }
            }else{
                cart.items[req.body._id].qty += 1                 
            }

            cart.totalPrice += req.body.price
            cart.totalQty += 1

            return res.json({totalQty: req.session.cart.totalQty})
        },
    }
}