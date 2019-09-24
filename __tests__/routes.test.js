const request = require("supertest");
const server = require("../app.js");

beforeAll(async () => {
  console.log("Jest starting!");
});

afterAll(async () => {
  server.close();
  console.log("Server closed!");
});

describe("Basic route tests", () => {
  test("get home route GET /", async () => {
    const response = await request(server).get("/");

    expect(response.status).toEqual(200);
    expect(response.text).toContain("Hello World!");
  });
});
