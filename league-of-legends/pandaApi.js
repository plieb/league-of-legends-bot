const axios = require('axios');
const config = require('../config');

function getGames(leagueId) {
  return pandaApiCall(leagueId).then(response =>
    apiResultToCarousselle(response.data.results)
  );
}

function pandaApiCall(leagueId) {
  return axios.get(`https://api.pandascore.co/leagues/${leagueId}/series`, {
    headers: {
        Authorization: `Bearer ${confid.PANDA_TOKEN}`
    },
    params: {
      'filter[future]': true,
    },
  })
  .then(data => axios.get(`https://api.pandascore.co/tournaments/${data.tournaments[0].id}/matches`, {
    headers: {
        Authorization: `Bearer ${confid.PANDA_TOKEN}`
    },
    params: {
      'filter[future]': true,
    },
  })
  .catch(error => {
      return null
  });
}

function apiResultToCarousselle(results) {
  if (results.length === 0) {
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

  const cards = results.slice(0, 10).map(e => ({
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
