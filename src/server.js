import http from 'http';
import WebSocket from 'ws';
import express from 'express';

const PORT = 4000;

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('home');
});
app.get('/*', (req, res) => {
  res.redirect('/');
});

const handleListen = () =>
  console.log(`📡 Listening on http://localhost:${PORT}`);

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const onSocketClose = () => {
  console.log('Disconnected from the browser ❌');
};

const sockets = [];

wss.on('connection', socket => {
  sockets.push(socket);
  console.log('Connected to Browser 🔥');
  socket.on('close', onSocketClose);
  socket.on('message', message => {
    const tMessage = message.toString('utf8');
    sockets.forEach(aSocket => aSocket.send(tMessage));
  });
});

server.listen(PORT, handleListen);
