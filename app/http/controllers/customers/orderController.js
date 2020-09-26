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

            order.save().then(newOrder => {
                Order.populate(newOrder, {path: 'customerId'}, (err, result) => {
                    if(!err){
                        const eventEmitter = req.app.get('eventEmitter')
                        eventEmitter.emit('orderReceived', {newOrder})
                    }
                })
                req.session.cart = undefined
                req.flash('success', 'Order placed successfully.')
                return res.redirect('/customer/orders')
            }).catch((err) => {
                console.log(err);
                req.flash('error', 'Something went wrong.')
                return res.redirect('/cart')
            })
        },
        orders(req, res){
            Order.find({customerId: req.user._id}, null, {sort: { createdAt: -1 }}).then( orders => {
                return res.render('customer/orders', {orders, moment})
            }).catch(err => {
                console.log(err);
                return res.redirect('/')
            })
        },
        order(req, res){
            Order.findById(req.params.id).then(order => {
                if(order.customerId.toString() !== req.user._id.toString()){
                    req.flash('error', 'Order not found.')
                    return res.redirect('/')
                }
                return res.render('customer/singleOrder', {order})    
            }).catch(err => {
                console.log(err);
                return res.redirect('/', {order})    
            })

        },
    }    
}

module.exports = orderController