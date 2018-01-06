const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config');
const handlers = require('./league-of-legends');

const app = express();
app.use(bodyParser.json());

app.post('/lol-league-games', handlers.getLeagueGames)
app.post('/lol-team-games', handlers.getTeamGames)

app.post('/errors', function(req, res) {
  console.log(req.body);
  res.sendStatus(200);
});

const port = config.PORT;
app.listen(port, function() {
  console.log(`App is listening on port ${port}`);
});
