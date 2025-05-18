import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import dns from 'dns';

const app = express();

app.use(cors({ origin: '*' }));


const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  const clientIp = socket.handshake.address.replace('::ffff:', '');


  dns.reverse(clientIp, (err, hostnames) => {
    const resolvedHostname = err ? clientIp : hostnames[0];
    socket.emit('host_info', { ip: clientIp, hostname: resolvedHostname });
  });


socket.on('send_message', (msg) => {
    const ip = socket.handshake.address.replace('::ffff:', ''); 
    io.emit('receive_message', {
        ...msg,
        ip: ip === '::1' ? '127.0.0.1' : ip
    });
});


  socket.on('disconnect', () => {
    console.log(`User with ID ${socket.id} disconnected`);
  });
});

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
