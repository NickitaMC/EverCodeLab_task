const config = require('./config')
const createLogger = require('./logger')
const createScheduler = require('./scheduler')
const createApp = require("./app")

function startApp() {
    const logger = createLogger(config)
    const scheduler = createScheduler()
    const app = createApp(config)

    const taskName = "running logger"
    const interval = 10000
    const requestId = "startup-001"
    const port = config.port || 3000;

    logger.info(`Задача "${taskName}" выполняется каждые ${interval} миллисекунд.`, requestId)

    scheduler.schedule(
        taskName,
        interval, 
        () => {
            logger.debug("Запущено выполнение задачи", requestId)
            logger.info('running')
        }
    )

    app.listen(port, () =>{
    logger.info(`Сервер стартовал на порту ${port}`, requestId)
    })
}

module.exports = startApp