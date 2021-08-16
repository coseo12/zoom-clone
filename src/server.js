import http from 'http';
import SocketIO from 'socket.io';
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

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on('connection', socket => {
  socket.onAny(event => {
    console.log('Socket Event: ', event);
  });
  socket.on('enter_room', (roomName, done) => {
    socket.join(roomName);
    done();
  });
});

// const wss = new WebSocket.Server({ server });

// const onSocketClose = () => {
//   console.log('Disconnected from the browser ❌');
// };

// const sockets = [];
// wss.on('connection', socket => {
//   sockets.push(socket);
//   socket['nickname'] = 'Anon';
//   console.log('Connected to Browser 🔥');
//   socket.on('close', onSocketClose);
//   socket.on('message', message => {
//     const tMessage = message.toString('utf8');
//     const parsed = JSON.parse(tMessage);
//     switch (parsed.type) {
//       case 'new_message':
//         sockets.forEach(aSocket =>
//           aSocket.send(`${socket.nickname}: ${parsed.payload}`)
//         );
//         break;
//       case 'nickname':
//         socket['nickname'] = parsed.payload;
//         break;
//       default:
//         console.log('not used type');
//     }
//   });
// });

const handleListen = () =>
  console.log(`📡 Listening on http://localhost:${PORT}`);

httpServer.listen(PORT, handleListen);
