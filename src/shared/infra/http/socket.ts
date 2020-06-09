import socketIO from 'socket.io';
import http from 'http';
import app from './app';

interface ISocket {
  [key: string]: string;
}

const server = http.createServer(app).listen(process.env.SOCKET_PORT);
const socketConnection = socketIO.listen(server);
const socketConnectedClients: ISocket = {};

socketConnection.on('connection', socket => {
  const { provider_id } = socket.handshake.query;

  socketConnectedClients[provider_id] = socket.id;

  socket.on('disconnect', () => {
    delete socketConnectedClients[provider_id];
  });
});

export { socketConnection, socketConnectedClients };
