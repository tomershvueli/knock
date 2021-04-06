require('dotenv').config()

const express = require('express'),
  app = express(),
  port = process.env.port || 3000;

const fs = require("fs");
const zlib = require('zlib');

const { getRepos } = require("./util/github");

// Define routes

app.get("/v1/google/repositories", async (req, res) => {
  const repos = await getRepos();

  res.json(repos);
});

// TODO below method to be PUT
// https://stackoverflow.com/a/59690398/11646872
app.get("/v1/google/repositories/to_file", async (req, res) => {
  const repos = await getRepos();

  const z = zlib.createGzip();
  const writeStream = fs.createWriteStream('test.json.gz');
  z.pipe(writeStream);
  z.write(JSON.stringify(repos));
  z.end();

  res.sendStatus(200);
});

app.get("*", (req, res) => {
  res.status(404).send({
    url: `${req.originalUrl} not found`
  });
});

app.listen(port, () => console.log(`Server runnning on port ${port}`));
