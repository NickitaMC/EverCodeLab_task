const crypto = require("crypto");
const { ConfigError } = require("../errors");

function isHexToken(value) {
    return typeof value === "string" && /^[a-f0-9]{64}$/i.test(value);
}

function createAuthMiddleware(config) {
    const authToken = config && config.authToken;

    if (!isHexToken(authToken)) {
        throw new ConfigError("AUTH_TOKEN must be a 64-character hex string");
    }

    return (req, res, next) => {
        const header = req.get("Authorization");

        if (!header) {
            return res.status(401).send("Unauthorized");
        }

        const [scheme, token] = header.split(" ");

        if (scheme !== "Bearer" || !isHexToken(token)) {
            return res.status(403).send("Forbidden");
        }

        const currentToken = Buffer.from(token);
        const expectedToken = Buffer.from(authToken);

        if (currentToken.length !== expectedToken.length || !crypto.timingSafeEqual(currentToken, expectedToken)) {
            return res.status(403).send("Forbidden");
        }

        next();
    };
}

module.exports = createAuthMiddleware;
