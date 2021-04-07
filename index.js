require('dotenv').config();

const server = require('./server');

const PORT = process.env.PORT || 3000;

// Be sure developer set up the environment properly before starting the server
if (!process.env.GITHUB_AUTH_TOKEN) {
  console.log("Missing Github Auth Token environment variable - see README for more info. ");
  process.exit(1);
}

server.listen(PORT, () => console.log(`Server runnning on port ${PORT}`));
