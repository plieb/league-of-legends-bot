const leaguesLoL = [
  { id: 289, name: 'NA' },
  { id: 290, name: 'EU' },
  { id: 293, name: 'LCK' },
  { id: 294, name: 'LPL' },
  { id: 295, name: 'LMS' },
];

const teamsLoL = [
  // NA TEAMS
  { id: 1537, name: "100 Thieves", acronym: "100" },
  { id: 1536, name: "Clutch Gaming", acronym: "CG" },
  { id: 1535, name: "Golden Guardians", acronym: "GGS" },
  { id: 1385, name: "OpTic Gaming", acronym: "OPT" },
  { id: 1097, name: "Cloud9", acronym: "C9" },
  { id: 390, name: "Liquid", acronym: "TL" },
  { id: 389, name: "Counter Logic Gaming", acronym: "CLG" },
  { id: 387, name: "TSM", acronym: "TSM" },
  { id: 311, name: "FlyQuest", acronym: "FLY" },
  { id: 113, name: "Echo Fox", acronym: "FOX" },
  // EU TEAMS
];

function getLeagueId(league) {
  const row = leaguesLoL.find(function(elem) {
    return (elem.name.toLowerCase() === league.toLowerCase() || elem.acronym.toLowerCase() === league.toLowerCase())
  });

  if (row) {
    return row.id;
  }
  return null;
}

function getTeamId(team) {
  const row = teamsLoL.find(function(elem) {
    return elem.name.toLowerCase() === team.toLowerCase();
  });

  if (row) {
    return row.id;
  }
  return null;
}

module.exports = {
  leaguesLoL,
  teamsLoL,
  getLeagueId,
  getTeamId,
};
