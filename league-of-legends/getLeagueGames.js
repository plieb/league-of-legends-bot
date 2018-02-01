const axios = require('axios');
const config = require('../config');
const constants = require('./constants');

function getLeagueGames(req, res) {
  console.log('[GET] /lol-league-games');
  const memory = req.body.conversation.memory
  const league = memory['league-name'];
  const leagueId = constants.getLeagueId(league.value);

  if (memory['next']) {
    return futureLeagueGamesApiCall(leagueId)
      .then(apiResultToCarousselle)
      .then(function(carouselle) {
        res.json({
          replies: carouselle,
        });
      })
      .catch(function(err) {
        console.error('getLeagueGames::getGames error: ', err);
      });
  } else {
    return pastLeagueGamesApiCall(leagueId)
      .then(apiResultToCarousselle)
      .then(function(carouselle) {
        res.json({
          replies: carouselle,
        });
      })
      .catch(function(err) {
        console.error('getLeagueGames::getGames error: ', err);
      });
  }
}

function futureLeagueGamesApiCall(leagueId) {
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
    return axios.get(`https://api.pandascore.co/tournaments/${res.data[0].tournaments[0].id}/matches`, {
      headers: {
        Authorization: `Bearer ${config.PANDA_TOKEN}`
      },
      params: {
        'filter[future]': true,
        'sort': 'begin_at',
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

function pastLeagueGamesApiCall(leagueId) {
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
    return axios.get(`https://api.pandascore.co/tournaments/${res.data[0].tournaments[0].id}/matches`, {
      headers: {
        Authorization: `Bearer ${config.PANDA_TOKEN}`
      },
      params: {
        'filter[past]': true,
        'sort': '-begin_at',
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
        type: 'postback',
        value: `Get me some information about ${e.opponents[0].opponent.acronym}`,
        title: `${e.opponents[0].opponent.acronym} information`,
      },
      {
        type: 'postback',
        value: `Get me some information about ${e.opponents[1].opponent.acronym}`,
        title: `${e.opponents[1].opponent.acronym} information`,
      },
    ],
  }));

  return [
    { type: 'carousel', content: cards },
  ];
}

module.exports = {
  getLeagueGames,
};
