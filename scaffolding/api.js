'use strict'


const path = require('path');
const fs = require('fs');

const methods = new Map();

const loadMethod = (apiPath, name) => {
    const filePath = apiPath + name;
    const key = path.basename(filePath, '.js');
    try{
        const modulePath = require.resolve(filePath);
        delete require.cache[modulePath];
    }
    catch(err){
        return;
    }

    try{
        const method = require(filePath);
        methods.set(key, method);
    }
    catch(err){
        methods.delete(key);
    }
};

const api = {};

api.load = (apiPath) => {
    fs.readdir(apiPath, (err, files) => {
        if(err) return;
        files.forEach(file => loadMethod(apiPath, file));
    });
    return api;
};

api.get = key => methods.get(key);

module.exports = api;