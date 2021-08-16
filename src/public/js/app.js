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
  const input = room.querySelector('#message input');
  const value = input.value;
  socket.emit('new_message', value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = '';
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector('#nickname input');
  socket.emit('nickname', input.value, input.value);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = document.querySelector('h3');
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector('#message');
  const nameForm = room.querySelector('#nickname');
  msgForm.addEventListener('submit', handleMessageSubmit);
  nameForm.addEventListener('submit', handleNicknameSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector('input');
  socket.emit('enter_room', input.value, showRoom);
  roomName = input.value;
  input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', user => {
  addMessage(`${user} arrived!`);
});

socket.on('bye', user => {
  addMessage(`${user} left!`);
});

socket.on('new_message', addMessage);
