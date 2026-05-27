const request = require("supertest");
const createApp = require("../app");
const { createTestConfig } = require("./testUtils");

describe("System endpoints", () => {
    test("GET /status should return ok", async () => {
        const app = createApp(createTestConfig());

        const response = await request(app).get("/status");

        expect(response.status).toBe(200);
        expect(response.text).toBe("ok");
    });

    test("GET /openapi.json should expose project endpoints", async () => {
        const app = createApp(createTestConfig());

        const response = await request(app).get("/openapi.json");

        expect(response.status).toBe(200);
        expect(response.body.openapi).toBe("3.0.3");
        expect(response.body.paths).toHaveProperty("/status");
        expect(response.body.paths).toHaveProperty("/currencies");
        expect(response.body.paths).toHaveProperty("/currencies/{ticker}");
        expect(response.body.paths).toHaveProperty("/price");
    });
});
