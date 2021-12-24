const cp = require('child_process');
const os = require('os');


console.log(`Started master: ${process.pid}`);

function getRandom(min, max){
    return Math.random()*(max - min) + min;
} 

const cpusCount = os.cpus().length;
const workers = [];

for(let i = 0; i < cpusCount; i++){
    const worker = cp.fork('./worker.js');
    console.log(`Worker started: ${worker.pid}`);
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
        console.log(`Worker ${worker.pid} exited with code ${code}`);
    });

    worker.on('message', message => {
        console.log(`Message from worker ${worker.pid}: `);
        console.dir(message, {depth: 2})

        result.push(message);

        if(result.length === cpusCount){
            console.log(`Finished master: ${worker.pid}`);
            process.exit(0);
        }
    });

    setTimeout(() => process.exit(1), 5000);
});