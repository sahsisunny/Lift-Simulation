const multiplayerBtn = document.getElementById('multiplayer-btn');
const floatingBoxRooms = document.getElementsByClassName('floating-box');
const joinRoomBox = document.getElementsByClassName('join-room');
const createRoomBox = document.getElementsByClassName('create-room');
const closeBtn = document.querySelectorAll('.close-button');
const createRoomBtn = document.getElementById('create-room-btn');
const haveRoomBtn = document.getElementById('have-room-code-btn');
const joinRoomBtn = document.getElementById('join-room-btn');
const copyRoomCodeBtn = document.getElementById('copy-room-code-btn');

const roomCode = document.getElementById('copy-room-code-input');


// select area
const headerArea = document.getElementsByClassName('header');
const mainArea = document.getElementsByClassName('btn-section');
const footerArea = document.getElementsByClassName('footer');

function multiplayer(e) {
     e.preventDefault();
     console.log('multiplayer');
     floatingBoxRooms[0].classList.remove('hide');
     headerArea[0].classList.add('blur');
     mainArea[0].classList.add('blur');
     footerArea[0].classList.add('blur');
}

function closeBox(e) {
     e.preventDefault();
     console.log('close');
     floatingBoxRooms[0].classList.add('hide');
     joinRoomBox[0].classList.add('hide');
     createRoomBox[0].classList.add('hide');
     headerArea[0].classList.remove('blur');
     mainArea[0].classList.remove('blur');
     footerArea[0].classList.remove('blur');
}

function haveRoomCode(e) {
     e.preventDefault();
     console.log('have room code');
     joinRoomBox[0].classList.remove('hide');
     floatingBoxRooms[0].classList.add('hide');
}

function joinRoom(e) {
     e.preventDefault();
     console.log('join room');
}

function createRoom(e) {
     e.preventDefault();
     console.log('create room');
     createRoomBox[0].classList.remove('hide');
     floatingBoxRooms[0].classList.add('hide');
}

function copyRoomCode(e) {
     e.preventDefault();
     console.log('copy room code');
     roomCode.select();
     document.execCommand('copy');
     console.log('copied');
     console.log(roomCode.value);

}

multiplayerBtn.addEventListener('click', (e) => multiplayer(e));
haveRoomBtn.addEventListener('click', (e) => haveRoomCode(e));
joinRoomBtn.addEventListener('click', (e) => joinRoom(e));
closeBtn[0].addEventListener('click', (e) => closeBox(e));
closeBtn[1].addEventListener('click', (e) => closeBox(e));
closeBtn[2].addEventListener('click', (e) => closeBox(e));
createRoomBtn.addEventListener('click', (e) => createRoom(e));
copyRoomCodeBtn.addEventListener('click', (e) => copyRoomCode(e));