const { graphql } = require("@octokit/graphql");

// I was simply going to paginate through Github's search results here, but apparently they limit all Search queries to a max of 1000 items, no exceptions
// https://github.community/t/graphql-github-api-how-to-get-more-than-1000-pull-requests/13838/11
// https://docs.github.com/en/rest/reference/search#about-the-search-api
// ... *eyeroll*
// So now we need to do something silly like query one year at a time and paginate within that while making the (reasonable)
// assumption that no more than 1000 repos were created per year
async function getRepos() {
  let afterToken;
  const repos = [];

  // Get the total amount of repos that we want to query so we know when we'll be done querying years
  const totRepoCountRes = await graphql(`
    {
      search(query: "org:google", type: REPOSITORY, first: 100) {
        repositoryCount
      }
    }
  `,
  {
    headers: {
      authorization: `token ${process.env.GITHUB_AUTH_TOKEN}`,
    }
  });
  const totRepoCount = totRepoCountRes.search.repositoryCount;

  // Keep track of the year we are querying, start with current year
  let curYear = new Date().getFullYear();

  while (repos.length < totRepoCount) {
    // Create a `created` string to query repos created during a single year
    const createdStr = `${curYear}-01-01..${curYear + 1}-01-01`;

    do {
      const afterQuery = (afterToken) ? `, after: "${afterToken}"` : '';

      const graphqlRes = await graphql(`
        {
          search(query: "org:google created:${createdStr}", type: REPOSITORY, first: 100${afterQuery}) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                ... on Repository {
                  name
                }
              }
            }
          }
        }
      `,
      {
        headers: {
          authorization: `token ${process.env.GITHUB_AUTH_TOKEN}`,
        }
      });

      // Let's add the current repos to our array
      repos.push(...graphqlRes.search.edges.map(repo => {
        return {
          name: repo.node.name
        }
      }));

      if (graphqlRes.search.pageInfo.hasNextPage && graphqlRes.search.pageInfo.endCursor) {
        afterToken = graphqlRes.search.pageInfo.endCursor;
      } else {
        afterToken = "";
      }
    } while (afterToken);

    // Decrement a year so we can keep looking back until we have all the repos we need
    curYear--;
  }

  return repos;
}

module.exports = { getRepos };