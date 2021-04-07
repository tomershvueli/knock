# Knock - Integration Software Engineer Project

A Node API that exposes endpoints to query Github for all of Google's public repositories and to write those repos to a file. 

## Setup

### Pre-Requisites

This project utilizes the Github GraphQL API which requires an authentication token. You can get [your own token here](https://github.com/settings/tokens). You don't need to check any boxes when prompted. When you have the token, duplicate the `.env.sample` file and rename it `.env`. Set the `GITHUB_AUTH_TOKEN` environment variable to your newly created Github auth token.

### Running Locally

To run the project locally, run `yarn` to install all dependencies. To start the server, run `yarn start`. 

## Tests

To run all tests, hit `yarn test`. 

## Endpoints

`GET /v1/google/repositories` - Return an array of the names of all of Google's public repositories on Github. 

NOTE: This endpoint queries and paginates through all of Google's repos in the backend before returning a response - this take a long time. We know, but these were the requirements :)

`PUT /v1/google/repositories/to_file` - Write an array of all of Google's public repos on Github to a file at `/tmp/knock_interview.json.gz`.

NOTE: This endpoint queries and paginates through all of Google's repos in the backend before returning a response - this take a long time. We know, but these were the requirements :)
