const os = require('os');
const cluster = require('cluster');


console.log(`Started master: ${process.pid}`);

function getRandom(min, max){
    return Math.random()*(max - min) + min;
} 

const cpusCount = os.cpus().length;
const workers = [];

for (let index = 0; index < cpusCount; index++) {
    const worker = cluster.fork();
    console.log(`Worker started: ${process.pid}`);
    workers.push(worker);
}

const result = [];
const task = new Array(10);
for (let index = 0; index < task.length; index++) {
    task[index] = getRandom(9, 23299031);
}

workers.forEach(worker => {
    worker.send({task});

    worker.on('exit', code => {
        console.log(`Worker ${process.pid} exited with code ${code}`);
    });

    worker.on('message', message => {
        console.log(`Message from worker ${process.pid}: `);
        console.dir(message, {depth: 2})

        result.push(message);

        if(result.length === cpusCount){
            console.log(`Finished master: ${process.pid}`);
            process.exit(0);
        }
    });

    setTimeout(() => process.exit(1), 5000);
});