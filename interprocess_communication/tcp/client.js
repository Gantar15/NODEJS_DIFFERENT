const net = require('net');


const socket = new net.Socket();

const PORT = process.env.PORT || 3000;
socket.connect({
    port: PORT,
    host: '127.0.0.1'
}, () => {
    socket.on('error', err => console.log(err));

    socket.on('connect', socket => {
        console.log('Client socket -', socket);
    });

    socket.write('Hello from client');

    socket.on('data', data => {
        const message = data.toString();
        const user = JSON.parse(message);
        console.log(`Data received by client: ${data}` );
        console.log(`toString: ${message}`);
        console.log(`Age of ${user.name} is ${user.age}`);
    });
});