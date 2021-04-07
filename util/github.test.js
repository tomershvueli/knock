const github = require("./github");

const mockGraphqlOnePageResponse = require("./mocks/mockGraphqlOnePageResponse.json");
const mockGraphqlTwoPageResponsePageOne = require("./mocks/mockGraphqlTwoPageResponsePageOne.json");
const mockGraphqlTwoPageResponsePageTwo = require("./mocks/mockGraphqlTwoPageResponsePageTwo.json");

const { graphql } = require("@octokit/graphql")
jest.mock("@octokit/graphql", () => {
  return {
    graphql: jest.fn()
  };
});

describe("github util tests", () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should run graphql query once when only one page of repos", async () => {
    graphql.mockReturnValue(mockGraphqlOnePageResponse);

    const res = await github.getRepos();

    const expected = [
      {
        name: "google-repo-1"
      },
      {
        name: "google-repo-2"
      }
    ];

    expect(res).toEqual(expected);
    expect(graphql).toHaveBeenCalledTimes(1);
  });

  it("should run graphql query twice when there's another page of repos", async () => {
    graphql
      .mockReturnValueOnce(mockGraphqlTwoPageResponsePageOne)
      .mockReturnValueOnce(mockGraphqlTwoPageResponsePageTwo);

    const res = await github.getRepos();

    const expected = [
      {
        name: "google-repo-1"
      },
      {
        name: "google-repo-2"
      },
      {
        name: "google-repo-3"
      },
      {
        name: "google-repo-4"
      }
    ];

    expect(res).toEqual(expected);
    expect(graphql).toHaveBeenCalledTimes(2);
  });
});
