const config = require('../config');
const { getGames } = require('./pandaApi');
const constants = require('./constants');

function loadLoLGetLeaueGamesRoute(app) {
  app.post('/lol-league-games', function(req, res) {
    console.log('[GET] /lol-league-games');
    const league = req.body.conversation.memory['league-name'];
    const leagueId = constants.getLeagueId(league.value);

    return getGames(leagueId)
      .then(function(carouselle) {
        res.json({
          replies: carouselle,
        });
      })
      .catch(function(err) {
        console.error('pandApi::getGames error: ', err);
      });
  });
}
module.exports = loadLoLGetLeaueGamesRoute;
