const socket = io();

const welcome = document.querySelector('#welcome');
const form = welcome.querySelector('form');
const input = form.querySelector('input');

function backendDone(msg) {
  console.log('Backend from message: ', msg);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector('input');
  socket.emit('enter_room', { payload: input.value }, backendDone);
  input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);
