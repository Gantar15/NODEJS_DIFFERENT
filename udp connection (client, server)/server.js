const dgram = require('dgram');


const server = dgram.createSocket('udp4');

server.on('connect', () => {
    console.log("Client was connected");
});
server.on('error', err => {
    console.log(`Error on server ${err.message}`)
});
server.on('message', (msg, rinfo) => {
    console.dir({ msg: msg.toString('utf8'), rinfo });
});

server.bind(6300, () => {
    console.log(`Server was started on port ${server.address().port}`);
});