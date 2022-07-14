//Menu is dropping down and up
const menuToggle = document.querySelector('.menu-toggle');
const header = document.querySelector('.header');
const listMenu = document.querySelector('.list-menu');
const section = document.querySelector('section');

const home = document.querySelector('#home-active');
const menu = document.querySelector('#menu-active');
const about = document.querySelector('#about-active');
const contactUs=document.querySelector('#contact-us-active');

const cartBtn = document.querySelector('.shopping-cart');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.shopping-cart-count');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelectorAll('.image-box-container');

const productsSection =[ ... productsDOM];

menuToggle.addEventListener('click',() =>{
    header.classList.toggle('show-menu');
    if (header.classList.contains('show-menu')){
        listMenu.style.maxHeight = listMenu.scrollHeight + 'px';
        setTimeout(() =>{
            listMenu.style.overflow = 'visible';
            },300);
        }
    else{
        listMenu.style.maxHeight = '0px';
        listMenu.style.overflow = 'hidden';
    }
});

//Automate change image slider
var counter = 1;
setInterval(function(){
    document.querySelector('#radio' + counter).checked = true;
    counter++;
    if(counter > 4)counter=1;
},5000);


//Change color for menu when click on section


home.addEventListener('click',() =>{
    home.classList.add('active');
    menu.classList.remove('active');
    about.classList.remove('active');
    contactUs.classList.remove('active');
    listMenu.style.maxHeight = '0px';
    listMenu.style.overflow = 'hidden';
    header.classList.toggle('show-menu');

})

menu.addEventListener('click',() =>{
    home.classList.remove('active');
    menu.classList.add('active');
    about.classList.remove('active');
    contactUs.classList.remove('active');
    listMenu.style.maxHeight = '0px';
    listMenu.style.overflow = 'hidden';
    header.classList.toggle('show-menu');

})

about.addEventListener('click',() =>{
    home.classList.remove('active');
    menu.classList.remove('active');
    about.classList.add('active');
    contactUs.classList.remove('active');
    listMenu.style.maxHeight = '0px';
    listMenu.style.overflow = 'hidden';
    header.classList.toggle('show-menu');
})

contactUs.addEventListener('click',() =>{
    home.classList.remove('active');
    menu.classList.remove('active');
    about.classList.remove('active');
    contactUs.classList.add('active');
    listMenu.style.maxHeight = '0px';
    listMenu.style.overflow = 'hidden';
    header.classList.toggle('show-menu');

})

//Cart manipulation

let cart = [];
let buttonsDOM = [];

//getting the products
class Products {
    async getProducts(){
        try{
            let result  = await fetch('./assets/scripts/products.json');
            let data = await result.json();
            let products = data.items;
            products = products.map(item =>{
                const {title,price} = item.fields;
                const {id} = item.sys;
                const image = item.fields.image.fields.file.url;
                return {title,price,id,image};
            })
            return products;
        }   catch (error) {
                console.log(error);
        }
    }
}

//display products
class UI{
    displayProducts(products){
        let result = "";
        products.forEach(product => {
            result += `
            <div class="image-box">
                        <img src=${product.image} alt="">
                        <div class="item-description">
                            <h2>${product.title}</h2>
                            <h3>${product.price} Mdl</h3>
                            <button class="basket" data-id=${product.id}>Add to basket</button>
                        </div>
                    </div>
            `;
        });
        productsSection.forEach(product =>{
            product.innerHTML = result;})
    }
    getBagButtons(){
        const buttons = [... document.querySelectorAll('.basket') ];
        buttonsDOM = buttons;
        buttons.forEach(button =>{
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if (inCart){
                button.innerText = "Added to cart";
                button.disabled = true;
            }
            else{
                button.addEventListener('click', (event)=>{
                    event.target.innerText = 'Added to cart';
                    event.target.disabled = true;
                    
                    //get product from products
                    let cartItem = {...Storage.getProduct(id), amount:1};
                    cart = [...cart, cartItem];
                    //save cart in local storage
                    Storage.saveCart(cart);
                    //set cart values
                    this.setCartValues(cart);
                    //display cart item
                    this.addCartItem(cartItem);
                    //show the cart
                    this.showCart();

                });
            }
        });
    }
    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item =>{
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        })
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }

    addCartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
        <img src=${item.image} alt="">
        <div>
            <h4>${item.title}</h4>
            <h5>${item.price} Mdl</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>
        `;
        cartContent.appendChild(div);
    }
    showCart(){
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('show-cart');
    }
    setupAPP(){
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click',this.hideCart);
    }
    populateCart(cart){
        cart.forEach(item =>this.addCartItem(item));
    }
    hideCart(){
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('show-cart');
    }
    cartLogic(){
        //clear cart button
        clearCartBtn.addEventListener('click',() => {
            this.clearCart();
        });
        //cart functionality
        cartContent.addEventListener('click', event => {
            if ( event.target.classList.contains('remove-item')){
                let removeItem = event.target;
                let id = removeItem.dataset.id;                
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
            }
            else if(event.target.classList.contains('fa-chevron-up')){
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount += 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            }
            else if(event.target.classList.contains('fa-chevron-down')){
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount -= 1;
                if(tempItem.amount > 0){
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                }
                else{
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
            
        });
    }
    clearCart(){
        let cartItems =cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));

        while(cartContent.children.length>0){
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
    }
    removeItem(id){
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerText = "Add to basket";

    }
    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id ===id);
    }
}

//local Storage

class Storage{
    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products));
    }

    static getProduct(id){
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find(product => product.id === id);
    }

    static saveCart(cart){
        localStorage.setItem('cart',JSON.stringify(cart));
    }

    static getCart(){
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem("cart")) : [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const products = new Products();
    //setup app
    ui.setupAPP();

    //get all products
    products.getProducts().then(products => {
        ui.displayProducts(products);
    Storage.saveProducts(products);
    }).then( () => {
        ui.getBagButtons();
        ui.cartLogic();
    });
});