const express = require("express");
const config = require("./config");
const createAuthMiddleware = require("./middleware/authMiddleware");
const openApiSpec = require("./openapi");

const BINANCE_URL = "https://data-api.binance.vision/api/v3/ticker/price";

function createApp(appConfig = config, options = {}) {
    const app = express();
    const currencies = getInitialCurrencies(options.initialCurrencies);
    const fetchPrices = options.fetchPrices || getPrices;

    app.use(express.json());

    app.get("/status", (req, res) => {
        res.send("ok");
    });

    app.get("/openapi.json", (req, res) => {
        res.json(openApiSpec);
    });

    app.use(createAuthMiddleware(appConfig));

    app.get("/currencies", (req, res) => {
        res.json(currencies);
    });

    app.post("/currencies", (req, res) => {
        const currency = normalizeCurrency(req.body);

        if (!currency) {
            return res.status(400).json({ message: "Name and ticker are required" });
        }

        if (findCurrencyIndex(currencies, currency.ticker) !== -1) {
            return res.status(409).json({ message: "Currency already exists" });
        }

        currencies.push(currency);
        return res.status(201).json(currency);
    });

    app.get("/currencies/:ticker", (req, res) => {
        const index = findCurrencyIndex(currencies, req.params.ticker);

        if (index === -1) {
            return res.status(404).json({ message: "Currency not found" });
        }

        res.json(currencies[index]);
    });

    app.put("/currencies/:ticker", (req, res) => {
        const currentIndex = findCurrencyIndex(currencies, req.params.ticker);
        const currency = normalizeCurrency(req.body);

        if (currentIndex === -1) {
            return res.status(404).json({ message: "Currency not found" });
        }

        if (!currency) {
            return res.status(400).json({ message: "Name and ticker are required" });
        }

        const duplicateIndex = findCurrencyIndex(currencies, currency.ticker);

        if (duplicateIndex !== -1 && duplicateIndex !== currentIndex) {
            return res.status(409).json({ message: "Currency already exists" });
        }

        currencies[currentIndex] = currency;
        res.json(currency);
    });

    app.delete("/currencies/:ticker", (req, res) => {
        const index = findCurrencyIndex(currencies, req.params.ticker);

        if (index === -1) {
            return res.status(404).json({ message: "Currency not found" });
        }

        currencies.splice(index, 1);
        res.status(204).send();
    });

    app.get("/price", async (req, res) => {
        const ticker = normalizeTicker(req.query.currency);

        if (!ticker) {
            return res.status(400).json({ message: "Currency query is required" });
        }

        if (findCurrencyIndex(currencies, ticker) === -1) {
            return res.status(404).json({ message: "Currency not found" });
        }

        try {
            const prices = await fetchPrices();
            const result = prices.filter((item) => item && typeof item.symbol === "string" && item.symbol.includes(ticker));

            res.json({ currency: ticker, prices: result });
        } catch (error) {
            res.status(502).json({ message: "Failed to load prices" });
        }
    });

    return app;
}

function getInitialCurrencies(items = []) {
    return items.map(normalizeCurrency).filter(Boolean);
}

function normalizeCurrency(data) {
    if (!data || typeof data !== "object") {
        return null;
    }

    const name = typeof data.name === "string" ? data.name.trim() : "";
    const ticker = normalizeTicker(data.ticker);

    if (!name || !ticker) {
        return null;
    }

    return { name, ticker };
}

function normalizeTicker(value) {
    if (typeof value !== "string") {
        return null;
    }

    const ticker = value.trim().toUpperCase();
    return ticker || null;
}

function findCurrencyIndex(currencies, ticker) {
    const normalizedTicker = normalizeTicker(ticker);

    if (!normalizedTicker) {
        return -1;
    }

    return currencies.findIndex((currency) => currency.ticker === normalizedTicker);
}

async function getPrices() {
    const response = await fetch(BINANCE_URL);

    if (!response.ok) {
        throw new Error("Binance request failed");
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
}

module.exports = createApp;
