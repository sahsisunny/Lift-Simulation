const submitBTN = document.getElementById('submit-button');
const floorInput = document.getElementById('floor-input');
const LiftInput = document.getElementById('lift-input');
const outputArea = document.getElementsByClassName('output');

let floor;
let lift;

let freeLift = [];
let busyLift = [];

// Add event listener to store the floor number in the floor variable
floorInput.addEventListener('change', (e) => {
     floor = Number(e.target.value);
     if (floor < 0 || floor > 10) {
          alert(`You have entered ${floor} as your floor. Please enter a number between 0 and 10. Your floor has been set to 1.`);
          floor = 1;
          floorInput.value = floor;
     }
});

// Add event listener to store the lift number in the lift variable
LiftInput.addEventListener('change', (e) => {
     lift = Number(e.target.value);
     let screenSize = window.innerWidth;
     if (lift < 0 || lift > 15) {
          alert(`You have entered ${lift} as your lift. Please enter a number between 1 and 15. Your lift has been set to 1.`);
          lift = 1;
          LiftInput.value = lift;
     } else if (screenSize <= 1100 && lift > 5) {
          alert(`You have entered ${lift} as your lift. Please enter a number between 1 and 5. Because you have not enough space in your screen, your lift has been set to 5.`);
          lift = 5;
          LiftInput.value = lift;
     }

     // Add free lift to array
     for (let i = 0; i < lift; i++)
          freeLift.push(i);

});

// function for generate lift
function generateLift() {
     let addedLift = '';
     for (let i = 0; i < lift; i++) {
          addedLift += `<div class="lift" lift-position="${i}" ><div class="gate"></div></div>`;
     }
     return addedLift;
}

// function for clickHandler 
function clickHandler() {

     let addedFloor = ''
     for (let i = floor - 1; i >= 0; i--) {
          addedFloor += `
          <div id="floor-area">
               <div class="buttons">
                    ${i === 0 ? `<button class="btn move" id="down" btn-floor = "${i}">🔽</button>` : ``}
                    ${i !== 0 ? `<button class="btn move" id="up" btn-floor = "${i}">🔼</button><button class="btn move" id="down" btn-floor = "${i}">🔽</button>` : ``}
               </div>
               <div class="floor" floor-number = "${i}" >
                    ${i === 0 ? generateLift() : ''}
               </div>
               <div class="floor-level">
                    <p>${i}</p>
               </div>
          </div>
     `;
     }
     outputArea[0].innerHTML = addedFloor;

     // Add event listener to the move button
     const moveBTN = document.getElementsByClassName('move');
     for (let i = 0; i < moveBTN.length; i++) {
          moveBTN[i].addEventListener('click', (e) => {

               function upLift(n, n2) {
                    if (freeLift.length > 0) {
                         // get the floor position
                         const floorPositioNumber = e.target.getAttribute('btn-floor');

                         // get the lift
                         let lift = document.getElementsByClassName('lift');
                         let rLift = lift[freeLift[0]];

                         // get lift number
                         let liftNumber = rLift.getAttribute('lift-position');

                         // get the gate
                         let gate = document.getElementsByClassName('gate')[freeLift[0]];

                         // // move the lift
                         rLift.style.transform = `translateY(${((floorPositioNumber) * -100) - 2}%)`;
                         rLift.style.transition = `transform ${floorPositioNumber * n}s ease-in-out`;
                         setTimeout(() => {
                              gate.classList.add('gate-animate');
                         }, `${(floorPositioNumber * n2) * 1000}`);

                         // // open the gate
                         setTimeout(() => {
                              gate.classList.remove('gate-animate');
                         }, `${((floorPositioNumber * n2) * 1000) + 5000}`);

                         // remove the lift from the free lift array and add it to the busy lift array
                         freeLift.shift(busyLift.push(freeLift[0]));

                         // add the lift to the free lift array after 5 seconds
                         setTimeout(() => {
                              freeLift.push(busyLift.shift());
                              freeLift.sort();
                         }, `${((floorPositioNumber * n2) * 1000) + 6000}`);
                    } else {
                         alert('No lift is free right now. Please wait for a while.');
                    }
               }
               if (moveBTN[i].id === 'up') {
                    upLift(1, 1);
               } else if (moveBTN[i].id === 'down') {
                    upLift(i, i);
               }
          });
     }
}

// Add event listener to the submit button to generate the output
submitBTN.addEventListener('click', (e) => {
     e.preventDefault();
     clickHandler();
});
