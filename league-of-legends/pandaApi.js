const axios = require('axios');
const config = require('../config');

function getGames(leagueId) {
  return pandaApiCall(leagueId).then(response => {
      return apiResultToCarousselle(response)
  });
}

function pandaApiCall(leagueId) {
  return axios.get(`https://api.pandascore.co/leagues/${leagueId}/series`, {
    headers: {
        Authorization: `Bearer ${config.PANDA_TOKEN}`
    },
    params: {
      'filter[future]': true,
    },
  })
  .then(res => {
    return axios.get(`https://api.pandascore.co/tournaments/${res.data[0].tournaments[0].id}/matches`, {
      headers: {
        Authorization: `Bearer ${config.PANDA_TOKEN}`
      },
    })
  })
  .catch(function(error) {
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
        title: 'View More',
      },
    ],
  }));

  return [
    { type: 'carousel', content: cards },
  ];
}

module.exports = {
  getGames,
};
