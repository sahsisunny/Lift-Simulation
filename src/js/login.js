const socket = io();

const multiplayerBtn = document.getElementById("multiplayer-btn");
const floatingBoxRooms = document.querySelector(".floating-box");
const joinRoomBox = document.querySelector(".join-room");
const createRoomBox = document.querySelector(".create-room");
const closeBtns = document.querySelectorAll(".close-button");
const createRoomBtn = document.getElementById("create-room-btn");
const haveRoomBtn = document.getElementById("have-room-code-btn");
const joinRoomBtn = document.getElementById("join-room-btn");
const goLiveBtn = document.getElementById("go-live-btn");
const copyRoomCodeBtn = document.getElementById("copy-room-code-btn");
const snackbar = document.getElementById("snackbar");

const roomCodeInput = document.getElementById("copy-room-code-input");

const headerArea = document.querySelector(".header");
const mainArea = document.querySelector(".btn-section");
const footerArea = document.querySelector(".footer");

function multiplayer(e) {
  e.preventDefault();
  floatingBoxRooms.classList.remove("hide");
  headerArea.classList.add("blur");
  mainArea.classList.add("blur");
  footerArea.classList.add("blur");
}

function closeBox(e) {
  e.preventDefault();
  floatingBoxRooms.classList.add("hide");
  joinRoomBox.classList.add("hide");
  createRoomBox.classList.add("hide");
  headerArea.classList.remove("blur");
  mainArea.classList.remove("blur");
  footerArea.classList.remove("blur");
}

function haveRoomCode(e) {
  e.preventDefault();
  joinRoomBox.classList.remove("hide");
  floatingBoxRooms.classList.add("hide");
}

function createRoom(e) {
  e.preventDefault();
  const roomId = Math.random().toString(36).substring(7);
  socket.emit("createRoom", roomId);
  createRoomBox.classList.remove("hide");
  floatingBoxRooms.classList.add("hide");
}

function copyRoomCode(e) {
  e.preventDefault();
  roomCodeInput.select();
  roomCodeInput.setSelectionRange(0, 99999);
  document.execCommand("copy");
  showSnackbar("Room code copied to clipboard");
}

function joinRoom(e) {
  e.preventDefault();
  const roomId = document.getElementById("room-code-input").value;
  socket.emit("joinRoom", roomId);
}

function goLive(e) {
  e.preventDefault();
  const roomId = roomCodeInput.value;
  window.open(`/multiplayer.html?roomId=${roomId}`, "_blank");
  showSnackbar(`Going live in room ${roomId}`);
}

function showSnackbar(message) {
  snackbar.textContent = message;
  snackbar.className = "show";
  setTimeout(() => {
    snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
}

// Event listeners
multiplayerBtn.addEventListener("click", multiplayer);
closeBtns.forEach((btn) => btn.addEventListener("click", closeBox));
haveRoomBtn.addEventListener("click", haveRoomCode);
createRoomBtn.addEventListener("click", createRoom);
copyRoomCodeBtn.addEventListener("click", copyRoomCode);
joinRoomBtn.addEventListener("click", joinRoom);
goLiveBtn.addEventListener("click", goLive);

// Socket event handlers
socket.on("roomCreated", (roomId) => {
  roomCodeInput.value = roomId;
  console.log("Room created:", roomId);
});

socket.on("roomJoined", (roomId) => {
  console.log("Joined room:", roomId);
  window.location.href = `/multiplayer.html?roomId=${roomId}`;
});

socket.on("roomNotFound", () => {
  showSnackbar("Room not found. Please check the room code and try again.");
});

// Error handling
socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
  showSnackbar("Failed to connect to the server. Please try again.");
});
