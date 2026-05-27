const request = require("supertest");
const createApp = require("../app");
const {
    createTestConfig,
    getAuthHeader,
    invalidToken
} = require("./testUtils");

describe("Auth middleware", () => {
    test("GET /currencies without Authorization should return 401", async () => {
        const app = createApp(createTestConfig());

        const response = await request(app).get("/currencies");

        expect(response.statusCode).toBe(401);
        expect(response.text).toBe("Unauthorized");
    });

    test("GET /currencies with an invalid token should return 403", async () => {
        const app = createApp(createTestConfig());

        const response = await request(app)
            .get("/currencies")
            .set("Authorization", getAuthHeader(invalidToken));

        expect(response.statusCode).toBe(403);
        expect(response.text).toBe("Forbidden");
    });

    test("GET /currencies with a valid token should return 200", async () => {
        const app = createApp(createTestConfig());

        const response = await request(app)
            .get("/currencies")
            .set("Authorization", getAuthHeader());

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });
});
