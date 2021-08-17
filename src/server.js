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
  socket.on('join_room', (roonName, done) => {
    socket.join(roonName);
    done();
    socket.to(roonName).emit('welcome');
  });
});

const handleListen = () =>
  console.log(`📡 Listening on http://localhost:${PORT}`);

httpServer.listen(PORT, handleListen);
