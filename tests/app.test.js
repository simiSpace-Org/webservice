const request = require("supertest");
const app = require('./app')

describe("Get Test example", () => {
    test('successful GET api call', async() => {
        const response = await request(app).get("/healthz");
        expect(response.statusCode).toBe(200);
        });
});