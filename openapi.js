const bearerAuth = [{ bearerAuth: [] }];
const errorSchema = {
    type: "object",
    properties: {
        message: { type: "string" }
    }
};
const currencySchema = {
    type: "object",
    required: ["name", "ticker"],
    properties: {
        name: { type: "string", example: "Bitcoin" },
        ticker: { type: "string", example: "BTC" }
    }
};
const priceSchema = {
    type: "object",
    properties: {
        symbol: { type: "string", example: "BTCUSDT" },
        price: { type: "string", example: "100000.00" }
    }
};

function jsonResponse(description, schema) {
    return {
        description,
        content: {
            "application/json": {
                schema
            }
        }
    };
}

function textResponse(description, schema) {
    return {
        description,
        content: {
            "text/plain": {
                schema
            }
        }
    };
}

module.exports = {
    openapi: "3.0.3",
    info: {
        title: "EverCodeLab Task API",
        version: "1.0.0"
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer"
            }
        },
        schemas: {
            Currency: currencySchema,
            Error: errorSchema
        }
    },
    paths: {
        "/status": {
            get: {
                summary: "Check server status",
                security: [],
                responses: {
                    200: textResponse("Server is working", { type: "string", example: "ok" })
                }
            }
        },
        "/openapi.json": {
            get: {
                summary: "Get OpenAPI schema",
                security: [],
                responses: {
                    200: jsonResponse("OpenAPI schema", { type: "object" })
                }
            }
        },
        "/currencies": {
            get: {
                summary: "Get all currencies",
                security: bearerAuth,
                responses: {
                    200: jsonResponse("Currencies list", { type: "array", items: currencySchema }),
                    401: { description: "Unauthorized" },
                    403: { description: "Forbidden" }
                }
            },
            post: {
                summary: "Create currency",
                security: bearerAuth,
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: currencySchema
                        }
                    }
                },
                responses: {
                    201: jsonResponse("Created currency", currencySchema),
                    400: jsonResponse("Validation error", errorSchema),
                    409: jsonResponse("Currency already exists", errorSchema)
                }
            }
        },
        "/currencies/{ticker}": {
            get: {
                summary: "Get currency by ticker",
                security: bearerAuth,
                parameters: [
                    { name: "ticker", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    200: jsonResponse("Currency", currencySchema),
                    404: jsonResponse("Currency not found", errorSchema)
                }
            },
            put: {
                summary: "Update currency by ticker",
                security: bearerAuth,
                parameters: [
                    { name: "ticker", in: "path", required: true, schema: { type: "string" } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: currencySchema
                        }
                    }
                },
                responses: {
                    200: jsonResponse("Updated currency", currencySchema),
                    400: jsonResponse("Validation error", errorSchema),
                    404: jsonResponse("Currency not found", errorSchema),
                    409: jsonResponse("Currency already exists", errorSchema)
                }
            },
            delete: {
                summary: "Delete currency by ticker",
                security: bearerAuth,
                parameters: [
                    { name: "ticker", in: "path", required: true, schema: { type: "string" } }
                ],
                responses: {
                    204: { description: "Deleted" },
                    404: jsonResponse("Currency not found", errorSchema)
                }
            }
        },
        "/price": {
            get: {
                summary: "Get prices from Binance by currency ticker",
                security: bearerAuth,
                parameters: [
                    { name: "currency", in: "query", required: true, schema: { type: "string" } }
                ],
                responses: {
                    200: jsonResponse("Prices", {
                        type: "object",
                        properties: {
                            currency: { type: "string", example: "BTC" },
                            prices: { type: "array", items: priceSchema }
                        }
                    }),
                    400: jsonResponse("Validation error", errorSchema),
                    404: jsonResponse("Currency not found", errorSchema),
                    502: jsonResponse("Binance error", errorSchema)
                }
            }
        }
    }
};
