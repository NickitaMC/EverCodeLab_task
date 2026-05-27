const startApp = require("./startApp");
const {MyError} = require("./errors");

try {

    startApp();

} catch (error){
    if (error instanceof MyError) {
        console.error(`[My ERROR]: ${error.message}`);
    } else {
        console.error('[UNKNOWN ERROR]:', error);
    }
}