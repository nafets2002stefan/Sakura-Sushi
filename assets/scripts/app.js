//Menu is dropping down and up
menuToggle = document.querySelector('.menu-toggle');
header = document.querySelector('.header');
listMenu = document.querySelector('.list-menu');
section = document.querySelector('section');

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

const home = document.querySelector('#home-active');
const menu = document.querySelector('#menu-active');
const about = document.querySelector('#about-active');
const contactUs=document.querySelector('#contact-us-active');
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
