const github = require("./github");

const mockGraphqlOnePageResponse = require("./mocks/mockGraphqlOnePageResponse.json");
const mockGraphqlTwoPageResponsePageOne = require("./mocks/mockGraphqlTwoPageResponsePageOne.json");
const mockGraphqlTwoPageResponsePageTwo = require("./mocks/mockGraphqlTwoPageResponsePageTwo.json");
const mockGraphqlMultiYearResponseYearOne = require("./mocks/mockGraphqlMultiYearResponseYearOne.json");
const mockGraphqlMultiYearResponseYearTwo = require("./mocks/mockGraphqlMultiYearResponseYearTwo.json");

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

  it("should run graphql query twice when only one page of repos", async () => {
    const totRepoCountTwo = {
      search: {
        repositoryCount: 2
      }
    };

    graphql
      .mockReturnValueOnce(totRepoCountTwo)
      .mockReturnValueOnce(mockGraphqlOnePageResponse);

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
    expect(graphql).toHaveBeenCalledTimes(2);
    expect(graphql.mock.calls[1][0].includes("2021-01-01..2022-01-01")).toBe(true);
  });

  it("should run graphql query thrice when there's another page of repos for the same year", async () => {
    const totRepoCountFour = {
      search: {
        repositoryCount: 4
      }
    };

    graphql
      .mockReturnValueOnce(totRepoCountFour)
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
    expect(graphql).toHaveBeenCalledTimes(3);
    expect(graphql.mock.calls[1][0].includes("2021-01-01..2022-01-01")).toBe(true);
    expect(graphql.mock.calls[2][0].includes("2021-01-01..2022-01-01")).toBe(true);
  });

  it("should run graphql query four times when there's another page of repos for a different year", async () => {
    const totRepoCountFour = {
      search: {
        repositoryCount: 4
      }
    };

    graphql
      .mockReturnValueOnce(totRepoCountFour)
      .mockReturnValueOnce(mockGraphqlMultiYearResponseYearOne)
      .mockReturnValueOnce(mockGraphqlMultiYearResponseYearTwo);

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
    expect(graphql).toHaveBeenCalledTimes(3);
    expect(graphql.mock.calls[1][0].includes("2021-01-01..2022-01-01")).toBe(true);
    expect(graphql.mock.calls[2][0].includes("2020-01-01..2021-01-01")).toBe(true);
  });
});
