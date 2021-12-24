const http = require('http');
const os = require('os');
const cluster = require('cluster');
const roots = require('./routing');


const pid = process.pid;
const PORT = process.env.PORT || 5600;

async function parseRoot(url) {
    let data = roots[url];
    
    let query = {};
    if(!data){
        //Получаем объект названиями шаблонных групп и их значениями 
        for(const pathTemplate of Object.keys(roots)){
            if(pathTemplate.includes(':')){
                const regexpWithGroups = pathTemplate.split('\/').reduce((str, el) => {
                    if(el.startsWith(':')){
                        const query = el.slice(1);
                        return str + `(?<${query}>.*)` + '\/';
                    }
                    else 
                        el += '\/';
                    return str + el;
                }, '^');
                const match = (url+'\/').match(new RegExp(regexpWithGroups));

                if(!match) continue;
                query = match.groups;
                data = roots[pathTemplate];
                break;
            }
        }
    }
    
    const type = typeof data;
    const serializer = types[type];
    
    if(type == 'function')
        return serializer(data, query);
    else
        return serializer(data);
}

const types = {
    'number': val => ({
        code: 200,
        data: val.toString()
    }),
    'string': val => ({
        code: 200,
        data: val
    }),
    'undefined': () => ({
        code: 404,
        data: 'Not found'
    }),
    'function': (fn, query) => ({
        code: 200,
        data: fn(query)
    })
};

if(cluster.isMaster){
    const cpusCount = os.cpus().length;
    console.log(`Master pid: ${pid}`);
    console.log(`Starting ${cpusCount} forks`);
    for(let i = 0; i < cpusCount; i++) cluster.fork();
}
else if(cluster.isWorker){
    const id = cluster.worker.id;
    console.log(`Worker: ${id}, pid: ${pid}, port: ${PORT}`);

    const server = http.createServer((req, resp) => {
        resp.setHeader('Process-Id', pid);
        parseRoot(req.url).then(result => {
            resp.statusCode = result.code;
            return result.data;
        })
        .then((data) => {
            resp.end(data)
        })
        .catch(err => console.log(err));
    });
    server.listen(PORT, () => {
        console.log(`Server ${id} started on port ${PORT}`);
    });
}