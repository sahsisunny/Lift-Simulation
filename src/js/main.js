const submitBTN = document.getElementById('submit-button');      // Get the submit button
const floorInput = document.getElementById('floor-input');       // Get the floor number input
const LiftInput = document.getElementById('lift-input');         // Get the lift number input
const outputArea = document.getElementsByClassName('output');    // Get the output area div

let floor = 5;                       // Declare the floor variable to store the floor number
let lift = 5;                      // Declare the lift variable to store the lift number

/*
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
});
*/


let freeLift = [];
let busyLift = [];

// function for generate lift
function generateLift() {
     let addedLift = '';
     for (let i = 1; i <= lift; i++) {
          addedLift += `<div class="lift" lift-position="${i}" ><div class="gate"></div></div>`;
     }
     return addedLift;
}



// function for clickHandler 
function clickHandler() {

     let addedFloor = ''
     for (let i = floor; i >= 1; i--) {
          addedFloor += `
          <div id="floor-area">
               <div class="buttons">
                    ${i === 1 ? `<button class="btn move" id="up" btn-floor = "${i}">🔼</button>` : ``}
                    ${i === floor ? `<button class="btn move" id="down" btn-floor = "${i}">🔽</button>` : ``}
                    ${i !== 1 && i !== floor ? `<button class="btn move" id="up" btn-floor = "${i}">🔼</button><button class="btn move" id="down" btn-floor = "${i}">🔽</button>` : ``}
               </div>
               <div class="floor" floor-number = "${i}" >
                    ${i === 1 ? generateLift() : ''}
               </div>
               <div class="floor-level">
                    <p>${i + 1}</p>
               </div>
          </div>
     `;
     }
     outputArea[0].innerHTML = addedFloor;

     // Store free lift in an array
     for (let i = 0; i < lift; i++) {
          freeLift.push(i);
     }

     // Add event listener to the move button
     const moveBTN = document.getElementsByClassName('move');
     for (let i = 0; i < moveBTN.length; i++) {
          moveBTN[i].addEventListener('click', (e) => {
               console.log(`You have clicked the ${e.target.id} button of floor ${e.target.getAttribute('btn-floor')}`);

          });
     }
}






clickHandler();
/*
// Add event listener to the submit button to generate the output
submitBTN.addEventListener('click', (e) => {
     e.preventDefault();      // Prevent the default behaviour of the submit button 
});
*/