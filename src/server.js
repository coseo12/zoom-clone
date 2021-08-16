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
  socket['nickname'] = 'Anon';
  socket.onAny(event => {
    console.log('Socket Event: ', event);
  });
  socket.on('enter_room', (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit('welcome', socket.nickname);
  });
  socket.on('disconnecting', () => {
    socket.rooms.forEach(room => {
      socket.to(room).emit('bye', socket.nickname);
    });
  });
  socket.on('new_message', (msg, room, done) => {
    socket.to(room).emit('new_message', `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on('nickname', nickname => (socket['nickname'] = nickname));
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
