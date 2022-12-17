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
const resetBTN = document.getElementById('reset');

// data value
let floor = 0;
let lift = 0;
let freeLift = [];
let busyLift = [];
let prevLiftPosition = 1;

floorInput.addEventListener('change', (e) => {
     floor = e.target.value;
     let screenSize = window.innerWidth;
     if (floor < 0 || floor > 99) {
          alert(`You have entered ${floor} as your floor. Please enter a number between 1 and 99.`);
          floorInput.value = '5';
          floor = 5;
          floorInput.focus();
     }
});

liftInput.addEventListener('change', (e) => {
     lift = Number(e.target.value);
     let screenSize = window.innerWidth;
     if (lift < 0 || lift > 15) {
          alert(`You have entered ${lift} as your lift. Please enter a number between 1 and 15. Because you have enough space in your scree.`);
          floorInput.value = '';
          lift = 1;
          liftInput.focus();
     } else if (screenSize <= 1100 && lift > 4) {
          alert(`You have entered ${lift} as your lift. Please enter a number between 1 and 4. Because you have not enough space in your scree.`);
          floorInput.value = '';
          lift = 1;
          liftInput.focus();
     }
     for (let i = 0; i < lift; i++)
          freeLift.push(i);
});

// function to generate floor
function generateBuilding(floor, lift) {
     let floorHTML = '';
     for (let i = floor - 1; i >= 0; i--) {
          floorHTML +=
               `
          <div class="floor" id="floor${i}">
               <div class="lift-buttons">
               ${i === floor - 1 ? `<button id="down" class="lift-button move" data-btn-floor="${i}">⬇️</button>` : ''}
               ${i === 0 ? `<button id="up" class="lift-button move" data-btn-floor="${i}">⬆️</button>` : ''}
               ${i !== floor - 1 && i !== 0 ? `
               <button id="up" class="lift-button move" data-btn-floor="${i}">⬆️</button>
               <button id="down" class="lift-button move" data-btn-floor="${i}">⬇️</button>
               ` : ''}
               </div>
               <div class="lift-area">
                    ${i === 0 ? generateLift(lift) : ''}
               </div>
          </div>
          `;
     }
     liftArea[0].innerHTML = floorHTML;
}

// function to generate lift
function generateLift() {
     let addedLift = '';
     for (let i = 0; i < lift; i++) {
          addedLift += `
          <div class = "lift" id="lift${i}" data-current-floor="0" data-is-moving="false">
               <div class="lift-door door-left"></div>
               <div class="lift-door door-right"></div>
          </div>`;
     }
     return addedLift;
}

// Submit Click handler
submitBTN.addEventListener('click', (e) => {
     e.preventDefault();
     inputArea[0].classList.add('hide');
     outputArea[0].classList.remove('hide');
     generateBuilding(floor, lift);

     // Event Listener for Lift Button
     const moveBTN = document.getElementsByClassName('move');
     for (let i = 0; i < moveBTN.length; i++) {
          moveBTN[i].addEventListener('click', (e) => {
               // Move Lift Function
               function moveLift(e) {
                    e.preventDefault();
                    const floorDiv = e.target.parentNode.parentNode;
                    var [x, requestedFloorNo] = floorDiv.id.split("floor");
                    for (let i = 0; i < freeLift.length; i++) {
                         const lift = document.getElementById(`lift${freeLift[0]}`);
                         if (lift.dataset.isMoving === "false") {
                              let floorCalled = Math.abs(requestedFloorNo - lift.dataset.currentFloor);
                              let travelDuration = floorCalled * 2;
                              console.log(`Lift come from ${lift.dataset.currentFloor} to ${requestedFloorNo} in ${travelDuration} seconds`);

                              // Lift transform
                              lift.style.transform = `translateY(${((requestedFloorNo) * -128)}px)`;
                              lift.style.transition = `transform ${travelDuration}s ease-in-out`;
                              lift.dataset.isMoving = true;
                              e.target.classList.add('active-btn');


                              // Lift Gate
                              let lGate = document.getElementsByClassName('door-left')[freeLift[0]];
                              let rGate = document.getElementsByClassName('door-right')[freeLift[0]];
                              setTimeout(() => {
                                   lGate.classList.add("animation");
                                   rGate.classList.add("animation");
                                   console.log("Door Open");
                              }, `${(travelDuration) * 1000}`);

                              setTimeout(() => {
                                   lGate.classList.remove("animation");
                                   rGate.classList.remove("animation");
                                   // remove class name from button
                                   e.target.classList.remove('active-btn');
                                   console.log("Door close");
                              }, `${(travelDuration) * 1000 + 2600}`);

                              setTimeout(() => {
                                   lift.dataset.isMoving = false;
                              }, 2500);

                              freeLift.shift(busyLift.push(freeLift[0]));
                              setTimeout(() => {
                                   freeLift.push(busyLift.shift());
                                   freeLift.sort();
                              }, `${(travelDuration) * 1000 + 2600}`);
                              lift.setAttribute("data-current-floor", requestedFloorNo);
                              break;
                         }
                    }
               };
               moveLift(e);
          });
     }
});


// Back Button Click Handler
backBTN.addEventListener('click', (e) => {
     e.preventDefault();
     inputArea[0].classList.remove('hide');
     outputArea[0].classList.add('hide');
});

// Reset Button Click Handler
resetBTN.addEventListener('click', (e) => {
     e.preventDefault();
     location.reload();
});