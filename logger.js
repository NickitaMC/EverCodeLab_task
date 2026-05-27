const { ConfigError, ValidationError } = require("./errors");

const LEVELS = {
    error: "ERROR",
    warn: "WARN",
    info: "INFO",
    debug: "DEBUG",
    trace: "TRACE"
};

function validateConfig(config) {
    if (!config || typeof config !== "object") {
        throw new ConfigError("Нет конфигурации логгера");
    }

    if (typeof config.appName !== "string" || config.appName.trim() === "") {
        throw new ConfigError("Название приложения должно быть непустой строкой");
    }
}

function validateMessage(message) {
    if (typeof message !== "string" || message.trim() === "") {
        throw new ValidationError("Сообщение логгера должно быть непустой строкой");
    }
}

function validateRequestId(requestId) {
    if (requestId !== undefined && typeof requestId !== "string") {
        throw new ValidationError("requestId должен быть строкой");
    }

    if (typeof requestId === "string" && requestId.trim() === "") {
        throw new ValidationError("requestId не должен быть пустой строкой");
    }
}

function createLogger(config) {
    validateConfig(config);

    function formatMessage(level, message, requestId) {
        const time = new Date().toISOString();
        const requestPart = requestId ? ` [requestId=${requestId}]` : "";

        return `[${time}] [${config.appName}] [${level}]${requestPart}: ${message}`;
    }

    function log(level, message, requestId) {
        validateMessage(message);
        validateRequestId(requestId);

        const formattedMessage = formatMessage(level, message, requestId);

        if (level === LEVELS.error) {
            console.error(formattedMessage);
            return;
        }

        if (level === LEVELS.warn) {
            console.warn(formattedMessage);
            return;
        }

        console.log(formattedMessage);
    }

    return {
        error(message, requestId) {
            log(LEVELS.error, message, requestId);
        },

        warn(message, requestId) {
            log(LEVELS.warn, message, requestId);
        },

        info(message, requestId) {
            log(LEVELS.info, message, requestId);
        },

        debug(message, requestId) {
            log(LEVELS.debug, message, requestId);
        },

        trace(message, requestId) {
            log(LEVELS.trace, message, requestId);
        }
    };
}

module.exports = createLogger;