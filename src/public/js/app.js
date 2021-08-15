const host = window.location.host;
const socket = new WebSocket(`ws://${host}`);

socket.addEventListener('open', () => {
  console.log('Connected to Server 🔥');
});

socket.addEventListener('message', message => {
  console.log('Just got this: ', message.data, ' from the server');
});

socket.addEventListener('close', () => {
  console.log('Disconnected from the Server ❌');
});

setTimeout(() => {
  socket.send('hello from the browser!!');
}, 1000 * 2);
