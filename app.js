const config = require('./config');
const createLogger = require('./logger');
const createScheduler = require('./scheduler');

function startApp() {
    const logger = createLogger(config);
    const scheduler = createScheduler();

    const taskName = "running logger";
    const interval = 10000;
    const requestId = "startup-001";

    logger.info(`Задача "${taskName}" выполняется каждые ${interval} миллисекунд.`, requestId);

    scheduler.schedule(
        taskName,
        interval, 
        () => {
            logger.debug("Запущено выполнение задачи", requestId);
            logger.info('running');
        }
    );
}

module.exports = startApp;