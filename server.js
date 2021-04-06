require('dotenv').config()

const express = require('express'),
  app = express(),
  port = process.env.port || 3000;

const { graphql } = require("@octokit/graphql");

app.get("/v1/google/repositories", async (req, res) => {
  let afterToken;

  const repos = [];
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

  res.json(repos);
});

app.get("*", (req, res) => {
  res.status(404).send({
    url: `${req.originalUrl} not found`
  });
});

app.listen(port, () => console.log(`Server runnning on port ${port}`));
