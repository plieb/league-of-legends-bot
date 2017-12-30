const leaguesLoL = [
  { id: 289, name: 'NA' },
  { id: 290, name: 'EU' },
  { id: 293, name: 'LCK' },
  { id: 294, name: 'LPL' },
  { id: 295, name: 'LMS' },
];

const namesLoL = [
  { id: 289, team: 'NA' },
  { id: 290, team: 'EU' },
  { id: 293, team: 'LCK' },
  { id: 294, team: 'LPL' },
  { id: 295, team: 'LMS' },
];

function getLeagueId(league) {
  const row = leaguesLoL.find(function(elem) {
    return elem.name.toLowerCase() === league.toLowerCase();
  });

  if (row) {
    return row.id;
  }
  return null;
}

module.exports = {
  leaguesLoL,
  getLeagueId,
};
