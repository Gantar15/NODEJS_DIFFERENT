const net = require('net');
const dns = require('dns');


const data = {name: 'Valera', secondname: 'Vitalin', age: 27};

const PORT = process.env.PORT || 3000;
const server = net.createServer(socket => {
    console.log('Connected:', socket.localAddress);
    socket.write(JSON.stringify(data));

    socket.on('data', data => {
        const mess = data.toString();
        console.log(`Data received by server: ${mess}`);
    });

    socket.on('error', err => {
        console.log(err);
    });
});
server.listen(PORT, '127.0.0.1', () => {
    console.log(`Listenning server: ${server.address().port}`);
});