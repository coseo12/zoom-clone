const messageList = document.querySelector('ul');
const messageForm = document.querySelector('form');
const host = window.location.host;
const socket = new WebSocket(`ws://${host}`);

socket.addEventListener('open', () => {
  console.log('Connected to Server 🔥');
});

socket.addEventListener('message', message => {
  console.log('New message: ', message.data);
});

socket.addEventListener('close', () => {
  console.log('Disconnected from the Server ❌');
});

const handleSubmit = event => {
  event.preventDefault();
  const input = document.querySelector('input');
  socket.send(input.value);
  input.value = '';
};

messageForm.addEventListener('submit', handleSubmit);
