// Input
const floorInput = document.getElementById('floor');
const liftInput = document.getElementById('lift');
const submitBTN = document.getElementById('submit');

// area
const inputArea = document.getElementsByClassName('input-area');
const outputArea = document.getElementsByClassName('output-area');
const liftArea = document.getElementsByClassName('building');

// for Action Button
const backBTN = document.getElementById('back');

// data value
let floor = 0;
let lift = 0;
let freeLift = [];
let busyLift = [];
let liftQueue = [];


function handleFloorInputChange(e) {
     floor = e.target.value;
     if (floor < 0 || floor > 99) {
          alert(`You have entered ${floor} as your floor. Please enter a number between 1 and 99.`);
          floorInput.value = '5';
          floor = 5;
          floorInput.focus();
     }
}

function handleLiftInputChange(e) {
     lift = Number(e.target.value);
     let screenSize = window.innerWidth;
     if (lift < 0 || lift > 15) {
          alert(`You have entered ${lift} as your lift. Please enter a number between 1 and 15. Because you have enough space in your scree.`);
          floorInput.value = '5';
          lift = 5;
          liftInput.focus();
     } else if (screenSize <= 1100 && lift > 4) {
          alert(`You have entered ${lift} as your lift. Please enter a number between 1 and 4. Because you have not enough space in your scree.`);
          floorInput.value = '4';
          lift = 4;
          liftInput.focus();
     }
     for (let i = 0; i < lift; i++)
          freeLift.push(i);
}

// function to generate floor
function generateBuilding() {
     let floorHTML = '';
     for (let i = floor - 1; i >= 0; i--) {
          let liftButtons = '';
          if (i === floor - 1) {
               liftButtons = `<button id="down" class="lift-button move" data-btn-floor="${i}">⬇️</button>`;
          } else if (i === 0) {
               liftButtons = `<button id="up" class="lift-button move" data-btn-floor="${i}">⬆️</button>`;
          } else {
               liftButtons = `<button id="up" class="lift-button move" data-btn-floor="${i}">⬆️</button>
               <button id="down" class="lift-button move" data-btn-floor="${i}">⬇️</button>`;
          }
          let liftAreaHTML = i === 0 ? generateLift(lift) : '';
          floorHTML += `
               <div class="floor" id="floor${i}">
                    <div class="lift-buttons">
                         ${liftButtons}
                    </div>
                    <div class="lift-area">
                         ${liftAreaHTML}
                    </div>
               </div>
               `;
     }
     liftArea[0].innerHTML = floorHTML;
}

// function to generate lift
function generateLift(numOfLifts) {
     let liftElements = '';
     for (let i = 0; i < numOfLifts; i++) {
          liftElements += `
          <div class="lift" id="lift${i}" data-current-floor="0" data-is-moving="false">
               <div class="lift-door door-left"></div>
               <div class="lift-door door-right"></div>
          </div>`;
     }
     return liftElements;
}

// Submit Click handler
submitBTN.addEventListener('click', (e) => {
     e.preventDefault();
     inputArea[0].classList.add('hide');
     outputArea[0].classList.remove('hide');
     generateBuilding();
     addMoveEventListener();
});

// Function to store lift button click
function storeLiftButtonClick(e) {
     e.preventDefault();
     let [x, requestedFloorNo] = e.target.dataset.btnFloor.split("floor");
     liftQueue.push(requestedFloorNo);
     console.log(liftQueue);
}


// Function to add event listener to move button
const addMoveEventListener = () => {
     const moveBTN = document.getElementsByClassName('move');
     for (let i = 0; i < moveBTN.length; i++) {
          moveBTN[i].addEventListener('click', moveLift);
     }
}

const moveLift = (e) => {
     e.preventDefault();
     const floorDiv = e.target.parentNode.parentNode;                                     // target floor div from move button
     var [x, requestedFloorNo] = floorDiv.id.split("floor");                              // get floor number from floor div id
     for (let i = 0; i < freeLift.length; i++) {                                          // loop through free lift array
          const lift = document.getElementById(`lift${freeLift[0]}`);                     // get lift element from free lift array
          if (lift.dataset.isMoving === "false") {                                        // check if lift is moving or not
               let floorCalled = Math.abs(requestedFloorNo - lift.dataset.currentFloor);  // get floor difference
               let travelDuration = floorCalled * 2;                                      // calculate travel duration
               let gateOpenDuration = travelDuration * 1000;                              // calculate gate open duration
               let gateCloseDuration = gateOpenDuration + 2600;                           // calculate gate close duration
               let resetLiftDuration = gateCloseDuration + 1000;                          // calculate reset lift duration
               console.log(`Lift come from ${lift.dataset.currentFloor} to ${requestedFloorNo} in ${travelDuration} seconds`);    // log travel duration
               lift.style.transform = `translateY(${((requestedFloorNo) * -128)}px)`;     // move lift
               lift.style.transition = `transform ${travelDuration}s ease-in-out`;        // set lift transition
               lift.dataset.isMoving = true;                                              // set lift is moving to true     
               e.target.classList.add('active-btn');                                      // add active class to move button

               // Lift Gate
               let lGate = document.getElementsByClassName('door-left')[freeLift[0]];   // get left gate element from free lift array
               let rGate = document.getElementsByClassName('door-right')[freeLift[0]];  // get right gate element from free lift array
               setTimeout(() => {
                    lGate.classList.add("animation");                                    // add animation class to left gate
                    rGate.classList.add("animation");                                    // add animation class to right gate
                    console.log("Door Open");                                             // log door open
               }, `${gateOpenDuration}`);

               setTimeout(() => {
                    lGate.classList.remove("animation");                                  // remove animation class from left gate
                    rGate.classList.remove("animation");                                  // remove animation class from right gate
                    e.target.classList.remove('active-btn');                              // remove active class from move button
                    console.log("Door close");                                            // log door close
               }, `${gateCloseDuration}`);

               freeLift.shift(busyLift.push(freeLift[0]));                                // shift free lift to busy lift

               setTimeout(() => {                                                         // reset lift  
                    freeLift.push(busyLift.shift());                                      // shift busy lift to free lift
                    freeLift.sort();                                                      // sort free lift array
                    lift.dataset.isMoving = false;                                        // set lift is moving to false
                    console.log("Lift Reset");                                            // log lift reset
               }, `${resetLiftDuration}`);

               lift.setAttribute("data-current-floor", requestedFloorNo);                 // set current floor to requested floor
               break;
          }
     }
};



// Back Button Click Handler
function showInputArea(e) {
     e.preventDefault();
     window.location.reload();
}

backBTN.addEventListener('click', showInputArea);

floorInput.addEventListener('change', handleFloorInputChange);
liftInput.addEventListener('change', handleLiftInputChange);