const axios = require('axios');
const config = require('../config');
const constants = require('./constants');

function getLeagueTeams(req, res) {
  console.log('[GET] /lol-league-teams');
  const league = req.body.conversation.memory['league-name'];
  const leagueId = constants.getLeagueId(league.value);

  return leagueTeamsApiCall(leagueId)
    .then(apiResultToCarousselle)
    .then(function(carouselle) {
      res.json({
        replies: carouselle,
      });
    })
    .catch(function(err) {
      console.error('getLeagueTeams::getTeams error: ', err);
    });
}

function leagueTeamsApiCall(leagueId) {
  return axios.get(`https://api.pandascore.co/leagues/${leagueId}/series`, {
    headers: {
        Authorization: `Bearer ${config.PANDA_TOKEN}`
    },
    params: {
      'filter[season]': 'Spring,Summer',
      'sort' : '-begin_at',
    },
  })
  .then(res => {
    return axios.get(`https://api.pandascore.co/tournaments/${res.data[0].tournaments[0].id}/teams`, {
      headers: {
        Authorization: `Bearer ${config.PANDA_TOKEN}`
      },
    })
  })
  .catch(function(error) {
    console.log('======================================')
    console.log(error)
    console.log('======================================')
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
          buttons: [{ title: 'Start over', value: 'What can you do' }],
        },
      },
    ];
  }

  const cards = results.data.slice(0, 10).map(e => ({
    title: e.acronym,
    subtitle: e.name,
    imageUrl: e.image_url,
    buttons: [
      {
        type: 'postback',
        value: `Show me the next games of ${e.acronym}`,
        title: 'Next games',
      },
      {
        type: 'postback',
        value: `Show me the roster of ${e.acronym}`,
        title: 'Roster',
      },
    ],
  }));

  return [
    { type: 'carousel', content: cards },
  ];
}

module.exports = {
  getLeagueTeams,
};
