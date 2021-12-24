const http = require('http');

const GITHUB_API_USERS_URL = 'http://jsonplaceholder.typicode.com/users/';

module.exports = (userNumber) => {
    const url = GITHUB_API_USERS_URL+userNumber;
    const request = http.get(url);
    return new Promise(resolve => {
        request.on('response', resp => {
            resp.on('data', data => {
                try{
                    const json = JSON.parse(data.toString('utf8'));
                    const html = `
                        <h1>${json.name}</h1>
                        <ul>
                            <li>username: ${json.username}</li> 
                            <li>email: ${json.email}</li>
                            <li>phone: ${json.phone}</li>
                        </ul>
                        <a href="${json.website}">SITE</a>
                    `;
                    resolve(html);
                }
                catch(err){
                    console.log(err);
                    resolve('Wrong json');
                }
            });
        });
    });
};