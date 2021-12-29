'use strict'


const path = require('path');
const fs = require('fs');

const entities = new Map();

const loadEntity = (schemaPath, name) => {
    const filePath = schemaPath + name;
    const key = path.basename(filePath, '.js');
    try{
        const modulePath = require.resolve(filePath);
        delete require.cache[modulePath];
    }
    catch(err){
        return;
    }

    try{
        const entity = require(filePath);
        entities.set(key, entity);
    }
    catch(err){
        entities.delete(key);
    }
};

const schema = {};

schema.load = (schemaPath) => {
    fs.readdir(schemaPath, (err, files) => {
        if(err) return;
        files.forEach(file => loadEntity(schemaPath, file));
    });
    return schema;
};

schema.get = key => entities.get(key);

module.exports = schema;