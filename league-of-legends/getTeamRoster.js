const axios = require('axios');
const config = require('../config');
const constants = require('./constants');

function getTeamRoster(req, res) {
  console.log('[GET] /lol-team-roster');
  const team = req.body.conversation.memory['team-name'];
  const teamId = constants.getTeamId(team.value);

  console.log('=================TEAMID=====================')
  console.log(teamId)
  console.log('=================TEAMID=====================')

  return teamRosterApiCall(teamId)
    .then(apiResultToCarousselle)
    .then(function(carouselle) {
      res.json({
        replies: carouselle,
      });
    })
    .catch(function(err) {
      console.error('getTeamRoster::getRoster error: ', err);
    });
}

function teamRosterApiCall(teamId) {
  return axios.get(`https://api.pandascore.co/teams/${teamId}`, {
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

  const cards = results.data.players.slice(0, 10).map(e => ({
    title: e.name,
    subtitle: e.first_name + ' ' + e.last_name,
    imageUrl: e.image_url,
    buttons: [
      {
        type: 'postback',
        value: `What are the next games of ${results.data.name}`,
        title: `${results.data.name} next games`,
      },
    ],
  }));

  return [
    { type: 'carousel', content: cards },
  ];
}

module.exports = {
  getTeamRoster,
};
