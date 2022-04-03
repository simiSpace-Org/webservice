const app = require("../api");
const request = require("supertest");

describe("GET /healthzz", () => {
    test("Testing GET API", async() => {
        const response = await request(app).get("/healthzz");
        expect(response.statusCode).toBe(200);
    });
});
