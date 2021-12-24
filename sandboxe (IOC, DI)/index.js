
'use strict';

const PARSING_TIMEOUT = 1000;
const EXECUTION_TIMEOUT = 5000;

const vm = require('vm');
const fs = require('fs');


const safeRequire = name => {
    if (name === 'fs') {
      const msg = 'You dont have access to fs API';
      console.log(msg);
      return new Error(msg);
    } else {
      return require(name);
    }
};

const runSandboxed = path => {
    const context = {
        module: {},
        require: safeRequire,
        api: {
            console: { log: console.log },
            timers: {
                setTimeout: setTimeout
            }
        }
    };
    context.global = context;
    
    const sandbox = vm.createContext(context);

    fs.readFile(path, (err, code) => {
        if(err) return;
    
        try{
            const prepareCode = `param => {${code}}`;
            const context = new vm.Script(prepareCode, {timeout: PARSING_TIMEOUT});
            const runCode = context.runInContext(sandbox, {timeout: EXECUTION_TIMEOUT});
            runCode({parent: __dirname.split('\\')[__dirname.split('\\').length-1]});
        }
        catch(err){
            console.log(err.message);
            return;
        }
    });
};

const path = process.argv[2] || '';
runSandboxed(path);