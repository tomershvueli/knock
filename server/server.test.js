const server = require(".");
const supertest = require("supertest");

const mockRepos = [
  {
    "name": "google-repo-1"
  },
  {
    "name": "google-repo-2"
  }
];

const { getRepos } = require("../util/github");
jest.mock("../util/github");

describe("server tests", () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return a 404 if we ping a route that doesn't exist", async () => {
    await supertest(server).get("/this_route_does_not_exist")
      .expect(404);
  });

  it("should return an array of repos when we query for google repositories", async () => {
    getRepos.mockReturnValue(mockRepos);

    const res = await supertest(server).get("/v1/google/repositories");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });
});
