'use strict';

const cp = require('child_process');
const os = require('os');

const pid = process.pid;
const cpusCount = os.cpus().length;

console.log(`Master pid: ${pid}`);
console.log(`Starting ${cpusCount} forks`);

for (let i = 0; i < cpusCount;) {
  cp.fork('./worker.js', [++i]);
}