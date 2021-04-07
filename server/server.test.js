const server = require(".");
const supertest = require("supertest");

describe("server tests", () => {

  it("should return a 404 if we ping a route that doesn't exist", async () => {
    await supertest(server).get("/this_route_does_not_exist")
      .expect(404);
  });

});
