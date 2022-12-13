const submitBTN = document.getElementById('submit-button');      // Get the submit button
const floorInput = document.getElementById('floor-input');       // Get the floor number input
const LiftInput = document.getElementById('lift-input');         // Get the lift number input
const outputArea = document.getElementsByClassName('output');    // Get the output area div

let floor;                       // Declare the floor variable to store the floor number
let lift;                     // Declare the lift variable to store the lift number

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
     // get screen size in variable
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
     // Add freelift array
     for (let i = 0; i < lift; i++) {
          freeLift.push(i);
     }
     console.log(`Free lift: ${freeLift}`);
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
               // console.log(`You have clicked the ${e.target.id} button of floor ${e.target.getAttribute('btn-floor')}`);
               console.log(`Busy lift: ${busyLift}`);

               if (moveBTN[i].id === 'up') {
                    if (freeLift.length > 0) {
                         // Get Floor position number
                         const floorPositioNumber = e.target.getAttribute('btn-floor');   // get the floor position number
                         console.log(`Button ID: ${e.target.id} and Button at floor: ${floorPositioNumber}`);

                         // get one random lift from the free lift array
                         // let freeLift[0] = freeLift[Math.floor(Math.random() * freeLift.length)];

                         // get the first lift from the free lift array

                         // get the lift
                         let lift = document.getElementsByClassName('lift');
                         let rLift = lift[freeLift[0]];

                         // get lift number
                         let liftNumber = rLift.getAttribute('lift-position');
                         console.log(`Lift number: ${liftNumber}`);

                         // get the gate
                         let gate = document.getElementsByClassName('gate')[freeLift[0]];
                         gate.classList.add('gate-animate');

                         // // move the lift
                         setTimeout(() => {
                              rLift.style.transform = `translateY(${((floorPositioNumber) * -100) - 5}%)`;
                              rLift.style.transition = `transform ${floorPositioNumber}s ease-in-out`;
                         }, 5000);

                         // // open the gate
                         setTimeout(() => {
                              gate.classList.remove('gate-animate');
                         }, `${(floorPositioNumber * 1000) + 5000}`);

                         // remove the lift from the free lift array and add it to the busy lift array
                         freeLift.shift(busyLift.push(freeLift[0]));
                         console.log(`Free lift: ${freeLift}`);
                         console.log(`Busy lift: ${busyLift}`);

                         // add the lift to the free lift array after 5 seconds
                         setTimeout(() => {
                              freeLift.push(busyLift.shift());
                         }, `${6000}`);
                    } else {
                         alert('No lift is free right now. Please wait for a while.');
                    }
               } else if (moveBTN[i].id === 'down') {
                    if (freeLift.length > 0) {
                         // Get Floor position number
                         const floorPositioNumber = e.target.getAttribute('btn-floor');   // get the floor position number
                         console.log(`Button ID: ${e.target.id} and Button at floor: ${floorPositioNumber}`);

                         // get one random lift from the free lift array
                         console.log(`Random lift: ${freeLift[0]}`);

                         // get the lift
                         let lift = document.getElementsByClassName('lift');
                         let rLift = lift[freeLift[0]];
                         console.log(rLift);

                         // get lift number
                         let liftNumber = rLift.getAttribute('lift-position');
                         console.log(`Lift number: ${liftNumber}`);

                         // get the gate
                         let gate = document.getElementsByClassName('gate')[freeLift[0]];
                         console.log(gate);
                         gate.classList.add('gate-animate');

                         // // move the lift
                         setTimeout(() => {
                              rLift.style.transform = `translateY(${((floorPositioNumber) * -100) + 10}%)`;
                              rLift.style.transition = `transform ${floorPositioNumber}s ease-in-out`;
                         }, 5000);

                         // remove the lift from the free lift array and add it to the busy lift array
                         freeLift.shift(busyLift.push(freeLift[0]));
                         console.log(`Free lift: ${freeLift}`);
                         console.log(`Busy lift: ${busyLift}`);

                         // add the lift to the free lift array after 5 seconds
                         setTimeout(() => {
                              freeLift.push(busyLift.shift());
                         }, `${1000}`);
                    } else {
                         alert('No lift is free right now. Please wait for a while.');
                    }
               }
          });


     }

}





// Add event listener to the submit button to generate the output
submitBTN.addEventListener('click', (e) => {
     e.preventDefault();      // Prevent the default behaviour of the submit button 
     clickHandler();
});
