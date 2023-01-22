const multiplayerBtn = document.getElementById('multiplayer-btn');
const floatingBox = document.getElementsByClassName('floating-box');
const closeBtn = document.getElementById('close-btn');

// select area
const headerArea = document.getElementsByClassName('header');
const mainArea = document.getElementsByClassName('btn-section');
const footerArea = document.getElementsByClassName('footer');

function multiplayer(e) {
     e.preventDefault();
     // remove hide class from floating box
     console.log('multiplayer'); 
     floatingBox[0].classList.remove('hide');
     headerArea[0].classList.add('blur');
     mainArea[0].classList.add('blur');
     footerArea[0].classList.add('blur');
}

function closeBox(e) {
     e.preventDefault();
     // add hide class to floating box
     console.log('close');
     floatingBox[0].classList.add('hide');
     headerArea[0].classList.remove('blur');
     mainArea[0].classList.remove('blur');
     footerArea[0].classList.remove('blur');
}
     

multiplayerBtn.addEventListener('click', (e) => multiplayer(e));
closeBtn.addEventListener('click', (e) => closeBox(e));

