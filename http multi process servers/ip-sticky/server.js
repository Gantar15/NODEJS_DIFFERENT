'use strict';

const os = require('os');
const net = require('net');
const http = require('http');
const cluster = require('cluster');
const cpus = os.cpus().length;


if(cluster.isMaster){
    console.log(`Master pid: ${process.pid}`);
    console.log(`Starting ${cpus} forks`);

    for(let i = 0; i < cpus; i++) cluster.fork();

    const ipToInt = ip => {
        return ip.split('::').reduce((intIp, group) => (intIp<<8) + (+group), 0);
    }

    const balancer = socket => {
        const intIp = ipToInt(socket.remoteAddress);
        const processIndex = Math.abs(intIp) % cpus;
        cluster.workers[processIndex].send({name: 'socket'}, socket);
    };

    const server = net.createServer(balancer);
    server.listen(3333);
}
else{
    console.log(`Worker pid: ${process.pid}`);

    const dispatcher = (req, res) => {
        console.log(req.url);
        res.setHeader('Process-Id', process.pid);
        res.end(`Hello from worker ${process.pid}`);
    };
    
    const server = http.createServer(dispatcher);
    server.listen(null);

    process.on('message', (mess, socket) => {
        if(mess.name = 'socket'){
            socket.server = server;
            server.emit('connection', socket);
        }
    });
}