const request = require("supertest");
const createApp = require("../app");
const { createTestConfig, getAuthHeader } = require("./testUtils");

describe("Currency CRUD endpoints", () => {
    test("should create, read, update, list and delete a currency", async () => {
        const app = createApp(createTestConfig());

        const createResponse = await request(app)
            .post("/currencies")
            .set("Authorization", getAuthHeader())
            .send({
                name: "Bitcoin",
                ticker: "btc"
            });

        expect(createResponse.status).toBe(201);
        expect(createResponse.body).toEqual({
            name: "Bitcoin",
            ticker: "BTC"
        });

        const listResponse = await request(app)
            .get("/currencies")
            .set("Authorization", getAuthHeader());

        expect(listResponse.status).toBe(200);
        expect(listResponse.body).toEqual([
            {
                name: "Bitcoin",
                ticker: "BTC"
            }
        ]);

        const getResponse = await request(app)
            .get("/currencies/BTC")
            .set("Authorization", getAuthHeader());

        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual({
            name: "Bitcoin",
            ticker: "BTC"
        });

        const updateResponse = await request(app)
            .put("/currencies/BTC")
            .set("Authorization", getAuthHeader())
            .send({
                name: "Ethereum",
                ticker: "eth"
            });

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body).toEqual({
            name: "Ethereum",
            ticker: "ETH"
        });

        const deleteResponse = await request(app)
            .delete("/currencies/ETH")
            .set("Authorization", getAuthHeader());

        expect(deleteResponse.status).toBe(204);

        const missingCurrencyResponse = await request(app)
            .get("/currencies/ETH")
            .set("Authorization", getAuthHeader());

        expect(missingCurrencyResponse.status).toBe(404);
        expect(missingCurrencyResponse.body).toEqual({
            message: "Currency not found"
        });
    });

    test("should reject duplicate currencies", async () => {
        const app = createApp(createTestConfig());

        await request(app)
            .post("/currencies")
            .set("Authorization", getAuthHeader())
            .send({
                name: "Bitcoin",
                ticker: "BTC"
            });

        const duplicateResponse = await request(app)
            .post("/currencies")
            .set("Authorization", getAuthHeader())
            .send({
                name: "Wrapped Bitcoin",
                ticker: "btc"
            });

        expect(duplicateResponse.status).toBe(409);
        expect(duplicateResponse.body).toEqual({
            message: "Currency already exists"
        });
    });
});
