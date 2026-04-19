const createLogger = require('./logger');
const log = createLogger();

function scheduleTask(name, interval, task) {
    log(`Задача "${name}" выполняется каждые ${interval} миллисекунд.`);

    setInterval(() => {
        task();
    }, interval);
}

scheduleTask('running logger', 10000, () => {
    log("running");
});

module.exports = scheduleTask;
