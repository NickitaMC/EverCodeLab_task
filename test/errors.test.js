const { ValidationError, MyError } = require("../errors");

describe("ValidationError", () => {
    test("должен создавать ошибку валидации с правильным сообщением", () => {
        const error = new ValidationError("Некорректные данные");

        expect(error).toBeInstanceOf(ValidationError);
        expect(error).toBeInstanceOf(MyError);
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("Некорректные данные");
        expect(error.name).toBe("ValidationError");
    });
});