class MyError extends Error {
    constructor(message){
        super(message);
        this.name = this.constructor.name; 
    
    }
}

class ValidationError extends MyError{}
class ConfigError extends MyError{}

module.exports = {
    MyError,
    ValidationError,
    ConfigError,
};