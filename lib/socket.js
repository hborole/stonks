import { Server } from 'socket.io';

export const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);

    io.on('connection', (socket) => {
      console.log('New client connected');
      socket.on('message', (msg) => {
        io.emit('message', msg);
      });
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
