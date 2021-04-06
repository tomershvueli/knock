const { graphql } = require("@octokit/graphql");

async function getRepos() {
  let afterToken;
  const repos = [];
  // TODO remove `runs`
  let runs = 0;

  do {
    const afterQuery = (afterToken) ? `, after: "${afterToken}"` : '';

    const graphqlRes = await graphql(`
      {
        rateLimit {
          limit
          cost
          remaining
          resetAt
        }
        search(query: "org:google", type: REPOSITORY, first: 100${afterQuery}) {
          pageInfo {
            startCursor
            hasNextPage
            endCursor
          }
          repositoryCount
          edges {
            cursor
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
      },
    });

    // Let's add the current repos to our array
    repos.push(...graphqlRes.search.edges.map(repo => {
      return {
        name: repo.node.name
      }
    }));

    runs++;
    if (graphqlRes.search.pageInfo.hasNextPage && graphqlRes.search.pageInfo.endCursor && runs < 3) {
      afterToken = graphqlRes.search.pageInfo.endCursor;
    } else {
      afterToken = "";
    }

  } while (afterToken);

  return repos;
}

module.exports = { getRepos };