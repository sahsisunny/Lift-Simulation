const submitBTN = document.getElementById('submit-button');
const floorInput = document.getElementById('floor-input');
const liftInput = document.getElementById('lift-input');
const outputArea = document.getElementsByClassName('output');

let floor;
let lift;

let freeLift = [];
let busyLift = [];

// Add event listener to store the floor number in the floor variable
floorInput.addEventListener('change', (e) => {
     floor = Number(e.target.value);
     if (floor <= 0 || floor > 10) {
          alert(`You have entered ${floor} as your floor. Please enter a number between 0 and 10. Your floor has been set to 1.`);
          floor = 1;
          floorInput.value = floor;
     }
});

// Add event listener to store the lift number in the lift variable
liftInput.addEventListener('change', (e) => {
     lift = Number(e.target.value);
     let screenSize = window.innerWidth;
     if (lift <= 0 || lift > 15) {
          alert(`You have entered ${lift} as your lift. Please enter a number between 1 and 15. Your lift has been set to 1.`);
          lift = 1;
          liftInput.value = lift;
     } else if (screenSize <= 1100 && lift > 5) {
          alert(`You have entered ${lift} as your lift. Please enter a number between 1 and 5. Because you have not enough space in your screen, your lift has been set to 5.`);
          lift = 5;
          liftInput.value = lift;
     }
     // Add free lift to array
     for (let i = 0; i < lift; i++)
          freeLift.push(i);
});

// function for generate lift
function generateLift() {
     let addedLift = '';
     for (let i = 0; i < lift; i++)
          addedLift += `<div class="lift" lift-position="${i}" ><div class="gate"></div></div>`;
     return addedLift;
}

// function for clickHandler 
function clickHandler(e) {
     e.preventDefault();
     let addedFloor = ''
     for (let i = floor - 1; i >= 0; i--)
          addedFloor += `
          <div id="floor-area">
               <div class="buttons">
                    ${i === 0 ? `<button class="btn move" id="down" btn-floor = "${i}">🔽</button>` : ``}
                    ${i !== 0 ? `<button class="btn move" id="up" btn-floor = "${i}">🔼</button><button class="btn move" id="down" btn-floor = "${i}">🔽</button>` : ``}
               </div>
               <div class="floor" floor-number = "${i + 1}" >${i === 0 ? generateLift() : ''}</div>
               <div class="floor-level"><p>${i}</p></div>
          </div>`;

     outputArea[0].innerHTML = addedFloor;                                                     // add the floor to the output area
     const moveBTN = document.getElementsByClassName('move');                                  // get the move button
     for (let i = 0; i < moveBTN.length; i++) {                                                // add event listener to the move button
          moveBTN[i].addEventListener('click', (e) => {                                        // add event listener to the move button
               function upLift(n, n2) {                                                        // function for move the lift up
                    if (freeLift.length > 0) {                                                 // check if there is a free lift
                         const floorPositioNumber = e.target.getAttribute('btn-floor');        // get the floor number
                         let lift = document.getElementsByClassName('lift');                   // get the lift
                         let rLift = lift[freeLift[0]];                                        // get the free lift
                         let liftNumber = rLift.getAttribute('lift-position');                 // get the lift number
                         let gate = document.getElementsByClassName('gate')[freeLift[0]];      // get the gate
                         function MoveLiftAndOthers() {                                        // function for move the lift and others
                              rLift.style.transform = `translateY(${((floorPositioNumber) * -100) - 2}%)`;    // move the lift to the floor
                              rLift.style.transition = `transform ${floorPositioNumber * n}s ease-in-out`;    // set the transition time
                              e.target.classList.add('active');                                     // add active class to the button
                              setTimeout(() => {                                                    // open the gate after 5 seconds
                                   gate.classList.add('gate-animate');                              // add the gate animation
                              }, `${(floorPositioNumber * n) * 1000}`);
                              setTimeout(() => {                                                    // close the gate after 10 seconds
                                   gate.classList.remove('gate-animate');                           // remove the gate animation
                                   e.target.classList.remove('active');                             // remove the active class from the button
                              }, `${((floorPositioNumber * n) * 1000) + 5000}`);
                              freeLift.shift(busyLift.push(freeLift[0]));                           // remove the lift from the free lift array and add the lift to the busy lift array
                              setTimeout(() => {                                            // add the lift to the free lift array after 15 seconds
                                   freeLift.push(busyLift.shift());                            // remove the lift from the busy lift array and add the lift to the free lift array
                                   freeLift.sort();                                            // sort the free lift array
                              }, `${((floorPositioNumber * n) * 1000) + 6000}`);
                         }
                         MoveLiftAndOthers();

                         // Print Data in the console
                         console.log(`Lift ${Number(liftNumber) + 1} is moving to floor ${floorPositioNumber} when ${e.target.id} button is clicked and the gate is opening after ${(floorPositioNumber * n2)} seconds and closing after ${(floorPositioNumber * n2) + 5} seconds.`);
                         console.log(`Free Lift: ${freeLift.length} and Busy Lift: ${busyLift.length}`);
                    } else alert('No lift is free right now. Please wait for a while.');
               }
               if (moveBTN[i].id === 'up') upLift(1, 1);
               else if (moveBTN[i].id === 'down') upLift(i / 2, 2);
          });
     }
}
submitBTN.addEventListener('click', (e) => clickHandler(e));                    // add event listener to the submit button