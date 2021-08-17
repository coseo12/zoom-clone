const socket = io();

const call = document.querySelector('#call');
const myFace = document.querySelector('#myFace');
const muteBtn = document.querySelector('#mute');
const cameraBtn = document.querySelector('#camera');
const camerasSelect = document.querySelector('#cameras');

let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;

call.hidden = true;

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === 'videoinput');
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement('option');
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label === camera.label) {
        option.selected = true;
      }
      camerasSelect.appendChild(option);
    });
  } catch (error) {
    console.error(error);
  }
}

async function getMedia(deviceId) {
  const initalConstrains = {
    audio: true,
    video: { facingMode: 'user' },
  };
  const cameraConstrainsts = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstrainsts : initalConstrains
    );
    myFace.srcObject = myStream;
    if (!deviceId) {
      await getCameras();
    }
  } catch (error) {
    alert(error);
  }
}

function handleMuteClick() {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));

  if (!muted) {
    muteBtn.innerText = 'Unmute';
    muted = true;
  } else {
    muteBtn.innerText = 'Mute';
    muted = false;
  }
}

function handleCameraClick() {
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));

  if (cameraOff) {
    cameraBtn.innerText = 'Turn Camera Off';
    cameraOff = false;
  } else {
    cameraBtn.innerText = 'Turn Camera On';
    cameraOff = true;
  }
}

function handleCameraChange() {
  getMedia(camerasSelect.value);
}

muteBtn.addEventListener('click', handleMuteClick);
cameraBtn.addEventListener('click', handleCameraClick);
camerasSelect.addEventListener('input', handleCameraChange);

// Welcome Form
const welcome = document.querySelector('#welcome');
const welcomeForm = welcome.querySelector('form');

async function initCall() {
  welcome.hidden = true;
  call.hidden = false;
  // Step 1.
  await getMedia();
  // Setp 2.
  await makeConnection();
}

async function handleWellcomeSubmit(event) {
  event.preventDefault();
  const input = welcomeForm.querySelector('input');
  await initCall();
  socket.emit('join_room', input.value);
  roomName = input.value;
  input.value = '';
}

welcomeForm.addEventListener('submit', handleWellcomeSubmit);

// Socket Code
socket.on('welcome', async () => {
  // Step 4.
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  console.log('sent the offer');
  socket.emit('offer', offer, roomName);
});

socket.on('offer', async (offer) => {
  // Step 5.
  myPeerConnection.setRemoteDescription(offer);
  // Step 6.
  const answer = await myPeerConnection.createAnswer();
  // Step 7.
  myPeerConnection.setLocalDescription(answer);
  socket.emit('answer', answer, roomName);
});

socket.on('answer', async (answer) => {
  // Step 8.
  myPeerConnection.setLocalDescription(answer);
});

// RTC Code
function makeConnection() {
  // Step 3.
  myPeerConnection = new RTCPeerConnection();
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}
