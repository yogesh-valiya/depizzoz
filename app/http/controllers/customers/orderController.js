const flash = require('express-flash')
const moment = require('moment')
const Order = require('../../../models/order')

function orderController() {
    return {
        placeOrder(req, res){

            let { phone, address } = req.body

            if(!phone || !address){
                req.flash('error', 'All fields are required.')
                req.flash('phone', phone)
                req.flash('address', address)
                return res.redirect('/cart')
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })

            order.save().then(() => {
                req.session.cart = undefined
                req.flash('success', 'Order placed successfully.')
                return res.redirect('/customer/orders')
            }).catch((err) => {
                console.log(err);
                req.flash('error', 'Something went wrong.')
                return res.redirect('/cart')
            })
        },
        async orders(req, res){
            let orders = await Order.find({customerId: req.user._id}, null, {sort: { createdAt: -1 }})
            return res.render('customer/orders', {orders, moment})
        },
    }    
}

module.exports = orderController