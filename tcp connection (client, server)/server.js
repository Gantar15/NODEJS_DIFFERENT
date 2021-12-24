const net = require('net');


const PORT = process.env.POST || 8000;

const connectionHandler = socket => {
    console.dir({
        localAddress: socket.localAddress,
        localPort: socket.localPort,
        remoteAddress: socket.remoteAddress,
        remoteFamily: socket.remoteFamily,
        remotePort: socket.remotePort,
        bufferSize: socket.bufferSize,
        timeout: socket.timeout
    });

    socket.write('💗');

    socket.on('data', (data) => {
      console.log('Event: 📨', data);
      console.log('Data:', data.toString());
    });
  
    socket.on('drain', () => {
      console.log('Event: 🤷');
    });
  
    socket.on('end', () => {
      console.log('Event: 🏁');
      console.dir({
        bytesRead: socket.bytesRead,
        bytesWritten: socket.bytesWritten,
      });
    });
  
    socket.on('error', (err) => {
      console.log('Event: 💩');
      console.log(err);
    });
  
    socket.on('timeout', () => {
      console.log('Event: ⌛');
    });
};

const server = new net.Server(connectionHandler);

server.on('close', () => {
    console.log('Server was closed');
});
server.on('error', err => {
    console.log(`Error on server: ${err}`);
});

server.listen(PORT, () => {
    console.log(`Server was started on port: ${PORT}`);
});