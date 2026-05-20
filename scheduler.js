const {ValidationError} = require("./errors")

function createScheduler() {
    return {
        schedule(name, interval, task) {
            if (typeof name !== "string" || name.trim() === "") {
                throw new ValidationError("Нет названия задачи!");
            }

            if (typeof interval !== "number" || interval <= 0) {
                throw new ValidationError("Интервал не может быть меньше или равен 0");
            }

            if (typeof task !== "function") {
                throw new ValidationError("task должен быть функцией");
            }

            return setInterval(task, interval);
            
        }
    };
}

module.exports = createScheduler;