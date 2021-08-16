const socket = io();

const welcome = document.querySelector('#welcome');
const form = welcome.querySelector('form');
const input = form.querySelector('input');
const room = document.querySelector('#room');

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = message;
  ul.append(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector('input');
  socket.emit('new_message', input.value, roomName, () => {
    addMessage(`You: ${input.value}`);
  });
  input.value = '';
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = document.querySelector('h3');
  h3.innerText = `Room ${roomName}`;
  const form = room.querySelector('form');
  form.addEventListener('submit', handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector('input');
  socket.emit('enter_room', input.value, showRoom);
  roomName = input.value;
  input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', () => {
  addMessage('Someone joined!');
});

socket.on('bye', () => {
  addMessage('Someone left!');
});

socket.on('new_message', addMessage);
