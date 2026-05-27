const validToken = "a".repeat(64);
const invalidToken = "b".repeat(64);

function createTestConfig() {
    return {
        appName: "TestApp",
        authToken: validToken
    };
}

function getAuthHeader(token = validToken) {
    return `Bearer ${token}`;
}

module.exports = {
    validToken,
    invalidToken,
    createTestConfig,
    getAuthHeader
};
