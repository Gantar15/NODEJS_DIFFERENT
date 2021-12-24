
const calculating = val => Math.sqrt(val);

process.on('message', message => {
    console.log(`Worker ${process.pid} has message: `);
    console.dir(message, {depth: 2})

    const result = message.task.map(calculating);
    process.send({ result });
});