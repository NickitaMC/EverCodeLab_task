const createLogger = require("../logger");

describe("logger", () => {
    test("info должен выводить сообщение в консоль", () => {
        jest.spyOn(console, "log").mockImplementation(() => {});

        const logger = createLogger({
            appName: "MyAppTask"
        });

        logger.info("Приложение запущено");

        expect(console.log).toHaveBeenCalledTimes(1);
        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining("Приложение запущено")
        );
        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining("MyAppTask")
        );
        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining("INFO")
        );

        console.log.mockRestore();
    });
});