const messageList = document.querySelector('ul');
const nickForm = document.querySelector('#nick');
const messageForm = document.querySelector('#message');
const host = window.location.host;
const socket = new WebSocket(`ws://${host}`);

const makeMessage = (type, payload) => {
  const msg = { type, payload, payload };
  return JSON.stringify(msg);
};

socket.addEventListener('open', () => {
  console.log('Connected to Server 🔥');
});

socket.addEventListener('message', message => {
  const li = document.createElement('li');
  li.innerText = message.data;
  messageList.append(li);
});

socket.addEventListener('close', () => {
  console.log('Disconnected from the Server ❌');
});

const handleSubmit = event => {
  event.preventDefault();
  const input = messageForm.querySelector('input');
  socket.send(makeMessage('new_message', input.value));
  input.value = '';
};
const handleNickSubmit = event => {
  event.preventDefault();
  const input = nickForm.querySelector('input');
  socket.send(makeMessage('nickname', input.value));
  input.value = '';
};

messageForm.addEventListener('submit', handleSubmit);
nick.addEventListener('submit', handleNickSubmit);
