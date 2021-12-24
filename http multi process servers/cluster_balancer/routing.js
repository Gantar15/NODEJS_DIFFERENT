const getGithubUser = require('./getData');

module.exports = {
    '/': 'Home page',
    '/user/:number': query => getGithubUser(query.number)
};