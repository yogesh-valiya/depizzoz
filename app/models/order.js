const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = new Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
         required: true,
         red: 'User'
        },
    items: {
        type: Object,
         required: true
        },
    phone: {type: String, required: true},
    address: {type: String, required: true},
    paymentType: {type: String, default: 'COD'},
    status: {type: String, default: 'order_placed'},
}, {timestamps: true})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order