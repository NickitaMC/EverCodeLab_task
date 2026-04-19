const config = require('./config');

function CreateLogger() {
    return function log(message) {
        console.log(`[${config.appName}]'${message}`);
    };
}

module.exports = CreateLogger;