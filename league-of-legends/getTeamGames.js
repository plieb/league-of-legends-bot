const axios = require('axios');
const config = require('../config');
const constants = require('./constants');

function getTeamGames(req, res) {
  console.log('[GET] /lol-team-games');
  const team = req.body.conversation.memory['team-name'];
  const teamId = constants.getTeamId(team.value);

  console.log('=================TEAMID=====================')
  console.log(teamId)
  console.log('=================TEAMID=====================')

  return teamGamesApiCall(teamId)
    .then(apiResultToCarousselle)
    .then(function(carouselle) {
      res.json({
        replies: carouselle,
      });
    })
    .catch(function(err) {
      console.error('getTeamGames::getGames error: ', err);
    });
}

function teamGamesApiCall(teamId) {
  return axios.get(`https://api.pandascore.co/teams/${teamId}/matches`, {
    headers: {
        Authorization: `Bearer ${config.PANDA_TOKEN}`
    },
    params: {
      'filter[future]': true,
    },
  })
  .catch(function(error) {
    console.log('---------ERROR-----------')
    console.log(error)
    console.log('---------ERROR-----------')
      return null
  });
}

function apiResultToCarousselle(results) {
  console.log('---------RESULTS-----------')
  console.log(results)
  console.log('---------RESULTS-----------')
  if (results === null || results.data.length === 0) {
    return [
      {
        type: 'quickReplies',
        content: {
          title: 'Sorry, but I could not find any results for your request :(',
          buttons: [{ title: 'Start over', value: 'Start over' }],
        },
      },
    ];
  }

  const cards = results.data.slice(0, 10).map(e => ({
    title: e.name,
    subtitle: e.begin_at || 'Date to be determined',
    imageUrl: e.league.image_url,
    buttons: [
      {
        type: 'web_url',
        value: e.league.url,
        title: 'View more about NA',
      },
    ],
  }));

  return [
    { type: 'carousel', content: cards },
  ];
}

module.exports = {
  getTeamGames,
};
