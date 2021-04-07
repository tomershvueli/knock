const express = require('express'),
  server = express();

const fs = require("fs");
const zlib = require('zlib');

const { getRepos } = require("../util/github");

// Define routes

server.get("/v1/google/repositories", async (req, res) => {
  const repos = await getRepos();

  res.json(repos);
});

// TODO below method to be PUT
// https://stackoverflow.com/a/59690398/11646872
server.get("/v1/google/repositories/to_file", async (req, res) => {
  const repos = await getRepos();

  const gz = zlib.createGzip();
  const writeStream = fs.createWriteStream('test.json.gz');
  gz.pipe(writeStream);
  gz.write(JSON.stringify(repos));
  gz.end();

  res.sendStatus(200);
});

server.get("*", (req, res) => {
  res.status(404).send({
    url: `${req.originalUrl} not found`
  });
});

// server.listen(port, () => console.log(`Server runnning on port ${port}`));

module.exports = server;
