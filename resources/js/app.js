import axios from 'axios';
import Noty from 'noty';
import moment from 'moment';

import { initAdmin } from './admin'

let socket = io()

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')
let message = document.querySelector('#success_alert')

function fadeout(ele) {
    var intervalID = setInterval(function () {       
        if (!ele.style.opacity) {
            ele.style.opacity = 1;
        } 
          
        if (ele.style.opacity > 0) { 
            ele.style.opacity -= 0.1/50; 
        }  
          
        else { 
            clearInterval(intervalID); 
        } 
          
    }, 10); 
}

const updateCart = pizza => {
    axios.post('/update-cart', pizza).then(res => {
        cartCounter.innerText = res.data.totalQty
        new Noty({
            text: 'A ' + pizza.size + ' sized ' + pizza.name + ' added to the cart successfully.',
            type: 'success',
            timeout: 3000,
        }).show();
    })
}

addToCart.forEach((ele => {
    ele.addEventListener('click', e => {
        const pizza = JSON.parse(ele.dataset.pizza)
        updateCart(pizza)
    })
}))

if(message){
    setTimeout(() => {
        fadeout(message)
    }, 5000)
}

initAdmin(socket    )


// Status Management
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)

function updateStatus(order) {
    let timeSnap = document.createElement('small')
    let stepCompleted = true

    statuses.forEach(status => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })

    statuses.forEach(status => {
        let currStatus = status.dataset.status
        if(stepCompleted){
            status.classList.add('step-completed')
        }
        if(currStatus === order.status){
            stepCompleted = false
            timeSnap.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(timeSnap)
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current')
            }
        }

    })
}

updateStatus(order)


if(order){
    socket.emit('join', `order_${order._id}`)
    socket.on('orderUpdate', data => {
        const updatedOrder = {...order}
        updatedOrder.updatedAt = moment().format()
        updatedOrder.status = data.status
        updateStatus(updatedOrder)
        new Noty({
            text: 'Order status updated.',
            type: 'success',
            timeout: 3000,
        }).show();
    })
}

const adminArea = window.location.pathname
if(adminArea === '/admin/orders'){
    console.log('Admin');
    socket.emit('join', 'adminRoom')
}