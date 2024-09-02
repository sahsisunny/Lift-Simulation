const socket = io();
const roomId = new URLSearchParams(window.location.search).get("roomId");

if (!roomId) {
  console.error("No room ID found");
  alert("No room ID found. Redirecting to the main page.");
  window.location.href = "/index.html";
}

document.getElementById("room-id").textContent = roomId;

// Selecting input and button elements
const floorInput = document.getElementById("floor");
const liftInput = document.getElementById("lift");
const submitBTN = document.getElementById("submit");

// Selecting areas
const inputArea = document.querySelector(".input-area");
const outputArea = document.querySelector(".output-area");
const liftArea = document.querySelector(".building");

// for Action Button
const backBTN = document.getElementById("back");

// data value
let floor = 0;
let lift = 0;
let freeLift = [];
let busyLift = [];

function handleFloorInputChange(e) {
  floor = parseInt(e.target.value);
  if (floor < 1 || floor > 99) {
    alert(`Please enter a number between 1 and 99 for floors.`);
    floorInput.value = "";
  }
}

function handleLiftInputChange(e) {
  lift = parseInt(e.target.value);
  let screenSize = window.innerWidth;
  if (lift < 1 || lift > 15) {
    alert(`Please enter a number between 1 and 15 for lifts.`);
    liftInput.value = "";
  } else if (screenSize <= 1100 && lift > 4) {
    alert(
      `Due to screen size limitations, please enter a number between 1 and 4 for lifts.`,
    );
    liftInput.value = "";
  }
}

function generateBuilding() {
  let floorHTML = "";
  for (let i = floor - 1; i >= 0; i--) {
    let liftButtons = "";
    if (i === floor - 1) {
      liftButtons = `<button class="lift-button move" data-btn-floor="${i}">⬇️</button>`;
    } else if (i === 0) {
      liftButtons = `<button class="lift-button move" data-btn-floor="${i}">⬆️</button>`;
    } else {
      liftButtons = `
                <button class="lift-button move" data-btn-floor="${i}">⬆️</button>
                <button class="lift-button move" data-btn-floor="${i}">⬇️</button>
            `;
    }
    let liftAreaHTML = i === 0 ? generateLift(lift) : "";
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
  liftArea.innerHTML = floorHTML;
}

function generateLift(numOfLifts) {
  let liftElements = "";
  for (let i = 0; i < numOfLifts; i++) {
    liftElements += `
            <div class="lift" id="lift-${i}" data-current-floor="0" data-is-moving="false">
                <div class="lift-door door-left"></div>
                <div class="lift-door door-right"></div>
            </div>
        `;
    freeLift.push(i);
  }
  return liftElements;
}

function startSimulation(e) {
  e.preventDefault();
  if (!floor || !lift) {
    alert("Please enter valid floor and lift numbers.");
    return;
  }
  inputArea.classList.add("hide");
  outputArea.classList.remove("hide");
  generateBuilding();
  addMoveEventListener();

  const liftState = {
    floor: floor,
    liftCount: lift,
    lifts: {},
  };
  for (let i = 0; i < lift; i++) {
    liftState.lifts[`lift-${i}`] = {
      currentFloor: 0,
      isMoving: false,
    };
  }
  socket.emit("updateLiftState", { roomId, liftState });
}

function addMoveEventListener() {
  const moveBTNs = document.querySelectorAll(".move");
  moveBTNs.forEach((btn) => btn.addEventListener("click", moveLift));
}

/*
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
*/
function moveLift(e) {
  e.preventDefault();
  const requestedFloorNo = parseInt(e.target.dataset.btnFloor);

  for (let i = 0; i < freeLift.length; i++) {
    const liftId = `lift-${freeLift[i]}`;
    const lift = document.getElementById(liftId);
    if (lift.dataset.isMoving === "false") {
      const currentFloor = parseInt(lift.dataset.currentFloor);
      const floorDifference = Math.abs(requestedFloorNo - currentFloor);
      const travelDuration = floorDifference * 2;

      setTimeout(() => {
        let floorCalled = Math.abs(
          requestedFloorNo - lift.dataset.currentFloor,
        ); // get floor difference
        let travelDuration = floorCalled * 2; // calculate travel duration
        let gateOpenDuration = travelDuration * 1000; // calculate gate open duration
        let gateCloseDuration = gateOpenDuration + 2600; // calculate gate close duration
        let resetLiftDuration = gateCloseDuration + 1000; // calculate reset lift duration
        console.log(
          `Lift come from ${lift.dataset.currentFloor} to ${requestedFloorNo} in ${travelDuration} seconds`,
        ); // log travel duration
        lift.style.transform = `translateY(${requestedFloorNo * -128}px)`; // move lift
        lift.style.transition = `transform ${travelDuration}s ease-in-out`; // set lift transition
        lift.dataset.isMoving = true; // set lift is moving to true
        e.target.classList.add("active-btn"); // add active class to move button

        // animate lift door after travel duration
        setTimeout(
          () => {
            let lGate =
              document.getElementsByClassName("door-left")[freeLift[0]]; // get left gate element from free lift array
            let rGate =
              document.getElementsByClassName("door-right")[freeLift[0]]; // get right gate element from free lift array
            setTimeout(() => {
              lGate.classList.add("animation"); // add animation class to left gate
              rGate.classList.add("animation"); // add animation class to right gate
              console.log("Door Open"); // log door open
            }, `${gateOpenDuration}`);

            setTimeout(() => {
              lGate.classList.remove("animation"); // remove animation class from left gate
              rGate.classList.remove("animation"); // remove animation class from right gate
              e.target.classList.remove("active-btn"); // remove active class from move button
              console.log("Door close"); // log door close
            }, `${gateCloseDuration}`);
          },
          `${travelDuration * 1000}`,
        );

        const liftState = {
          lifts: {
            [liftId]: {
              currentFloor: requestedFloorNo,
              isMoving: true,
            },
          },
        };

        socket.emit("updateLiftState", { roomId, liftState });

        setTimeout(() => {
          // Close doors after reaching the destination
          toggleLiftDoors(lift, false);

          setTimeout(() => {
            lift.dataset.isMoving = "false";
            socket.emit("updateLiftState", {
              roomId,
              liftState: {
                lifts: {
                  [liftId]: {
                    currentFloor: requestedFloorNo,
                    isMoving: false,
                  },
                },
              },
            });
          }, 500); // Wait for doors to close
        }, travelDuration * 1000);
      }, 500); // Wait for doors to open

      break;
    }
  }
}

function toggleLiftDoors(lift, open) {
  const leftDoor = lift.querySelector(".door-left");
  const rightDoor = lift.querySelector(".door-right");
  if (open) {
    leftDoor.classList.add("animation");
    rightDoor.classList.add("animation");
  } else {
    leftDoor.classList.remove("animation");
    rightDoor.classList.remove("animation");
  }
}

socket.on("updateLiftState", (liftState) => {
  console.log("Received lift state update:", liftState);
  if (liftState.floor && liftState.liftCount) {
    floor = liftState.floor;
    lift = liftState.liftCount;
    generateBuilding();
    addMoveEventListener();
  }

  Object.entries(liftState.lifts).forEach(([liftId, state]) => {
    const lift = document.getElementById(liftId);
    if (lift) {
      lift.style.transform = `translateY(${state.currentFloor * -128}px)`;
      lift.dataset.isMoving = state.isMoving.toString();
      lift.dataset.currentFloor = state.currentFloor;

      if (state.isMoving) {
        toggleLiftDoors(lift, true);
      }

      if (!state.isMoving) {
        toggleLiftDoors(lift, false);
      }
    }
  });
});

socket.on("updateLiftState", (liftState) => {
  console.log("Received lift state update:", liftState);
  if (liftState.floor && liftState.liftCount) {
    floor = liftState.floor;
    lift = liftState.liftCount;
    generateBuilding();
    addMoveEventListener();
  }

  Object.entries(liftState.lifts).forEach(([liftId, state]) => {
    const lift = document.getElementById(liftId);
    if (lift) {
      lift.style.transform = `translateY(${state.currentFloor * -128}px)`;
      lift.dataset.isMoving = state.isMoving.toString();
      lift.dataset.currentFloor = state.currentFloor;
    }
  });
});

function showInputArea(e) {
  e.preventDefault();
  window.location.reload();
}

// Event listeners
floorInput.addEventListener("change", handleFloorInputChange);
liftInput.addEventListener("change", handleLiftInputChange);
submitBTN.addEventListener("click", startSimulation);
backBTN.addEventListener("click", showInputArea);

// Socket connection error handling
socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
  alert("Failed to connect to the server. Please try again.");
});

// Join the room
socket.emit("joinRoom", roomId);

socket.on("roomJoined", (joinedRoomId) => {
  console.log(`Joined room: ${joinedRoomId}`);
});

socket.on("roomNotFound", () => {
  console.error("Room not found");
  alert("The specified room was not found. Redirecting to the main page.");
  window.location.href = "/index.html";
});
