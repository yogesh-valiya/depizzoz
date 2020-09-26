import axios from 'axios';
import Noty from 'noty';

import { initAdmin } from './admin'

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



initAdmin()