const order = require("../../../models/order")

function orderController() {
    return {
        orders(req, res) {
           order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 }}).populate('customerId', '-password').exec((err, orders) => {
               if(req.xhr) {
                   return res.json(orders)
               } else {
                return res.render('admin/orders')
               }
           })
        },
        changeStatus(req, res){
            const {orderId, status} = req.body

            if(!orderId || !status){
                res.flash('error', 'Invalid request. Please try again later.')
                return res.redirect('/admin/orders')
            }
            order.updateOne({_id: orderId}, {status}, (err, data) => {
                if(err){
                    res.flash('error', 'Something went wrong.')
                }
                return res.redirect('/admin/orders')
            })
        },
    }
}

module.exports = orderController