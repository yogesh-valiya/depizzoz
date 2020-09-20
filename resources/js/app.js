import axios from 'axios';
import Noty from 'noty';

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')


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