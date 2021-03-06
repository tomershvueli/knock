const express = require('express'),
  server = express();

const fs = require("fs");
const zlib = require('zlib');

const { getRepos } = require("../util/github");

// Define routes

server.get("/v1/google/repositories", async (req, res) => {
  try {
    const repos = await getRepos();

    res.json(repos);
  } catch (err) {
    // Be sure to log the error somewhere appropriate and notify code owners
    res.status(500).send({
      message: "There was a problem with your request"
    });
  }
});

// https://stackoverflow.com/a/59690398/11646872
server.put("/v1/google/repositories/to_file", async (req, res) => {
  try {
    const repos = await getRepos();

    const gz = zlib.createGzip();
    gz.on("error", () => {
      return res.status(500).send({
        error: "Problem writing to file"
      });
    });

    const writeStream = fs.createWriteStream("/tmp/knock_interview.json.gz");
    gz.pipe(writeStream);
    gz.write(JSON.stringify(repos));
    gz.end();

    res.sendStatus(200);
  } catch (err) {
    // Be sure to log the error somewhere appropriate and notify code owners
    res.status(500).send({
      message: "There was a problem with your request"
    });
  }
});

server.get("*", (req, res) => {
  res.status(404).send({
    url: `${req.originalUrl} not found`
  });
});

module.exports = server;
