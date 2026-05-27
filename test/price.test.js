const request = require("supertest");
const createApp = require("../app");
const { createTestConfig, getAuthHeader } = require("./testUtils");

describe("GET /price", () => {
    test("should return Binance prices that include the requested currency", async () => {
        const fetchPrices = jest.fn().mockResolvedValue([
            { symbol: "BTCUSDT", price: "100000.00" },
            { symbol: "ETHUSDT", price: "2500.00" },
            { symbol: "LTCBTC", price: "0.01" }
        ]);

        const app = createApp(createTestConfig(), { fetchPrices });

        await request(app)
            .post("/currencies")
            .set("Authorization", getAuthHeader())
            .send({
                name: "Bitcoin",
                ticker: "BTC"
            });

        const response = await request(app)
            .get("/price?currency=btc")
            .set("Authorization", getAuthHeader());

        expect(response.status).toBe(200);
        expect(fetchPrices).toHaveBeenCalledTimes(1);
        expect(response.body).toEqual({
            currency: "BTC",
            prices: [
                { symbol: "BTCUSDT", price: "100000.00" },
                { symbol: "LTCBTC", price: "0.01" }
            ]
        });
    });

    test("should return 404 when the currency is not stored", async () => {
        const app = createApp(createTestConfig(), {
            fetchPrices: jest.fn()
        });

        const response = await request(app)
            .get("/price?currency=BTC")
            .set("Authorization", getAuthHeader());

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: "Currency not found"
        });
    });
});
