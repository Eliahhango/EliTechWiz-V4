const axios = require('axios');
const { hango } = require("../framework/hango");
const conf = require(__dirname + '/../set');

// Football Data API URL and your API key
const apiKey = process.env.FOOTBALL_API_KEY || ''; // set FOOTBALL_API_KEY in set.env
const apiUrl = 'https://api.football-data.org/v4/competitions';

// Helper function to fetch data from the API
const fetchFootballData = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'X-Auth-Token': apiKey,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/** ✅ Premier League (EPL) Standings */
hango({
  nomCom: "epl",
  categorie: "football live",
  reaction: "⚽"
}, async (dest, hn, commandOptions) => {
  const { repondre } = commandOptions;
  
  // API URL for Premier League standings
  const standingsUrl = `${apiUrl}/PL/standings`;

  const data = await fetchFootballData(standingsUrl);
  if (!data || !data.standings) {
    return repondre("❌ Error fetching EPL standings.");
  }

  const standings = data.standings[0].table;
  let standingsMessage = "📊 *Premier League Table*\n";
  standings.forEach((team, index) => {
    standingsMessage += `${index + 1}. ${team.team.name} - ${team.points} Points\n`;
  });

  repondre(standingsMessage);
});

/** ✅ Premier League Matchday */
hango({
  nomCom: "epl_matchday",
  categorie: "football live",
  reaction: "📅"
}, async (dest, hn, commandOptions) => {
  const { repondre } = commandOptions;

  // API URL for upcoming EPL matches
  const matchesUrl = `${apiUrl}/PL/matches`;

  const data = await fetchFootballData(matchesUrl);
  if (!data || !data.matches) {
    return repondre("❌ Error fetching EPL matchday.");
  }

  const matches = data.matches;
  let matchdayMessage = "🗓️ *Upcoming EPL Matches*\n";
  matches.forEach(match => {
    matchdayMessage += `${match.homeTeam.name} vs ${match.awayTeam.name} - ${match.utcDate}\n`;
  });

  repondre(matchdayMessage);
});

/** ✅ Premier League Top Scorers */
hango({
  nomCom: "epl_table",
  categorie: "football live",
  reaction: "⚽"
}, async (dest, hn, commandOptions) => {
  const { repondre } = commandOptions;

  // API URL for Premier League top scorers
  const topScorerUrl = `${apiUrl}/PL/scorers`;

  const data = await fetchFootballData(topScorerUrl);
  if (!data || !data.scorers) {
    return repondre("❌ Error fetching EPL top scorers.");
  }

  const topScorers = data.scorers;
  let topScorerMessage = "🏆 *EPL Top Scorers*\n";
  topScorers.forEach((scorer, index) => {
    topScorerMessage += `${index + 1}. ${scorer.player.name} - ${scorer.numberOfGoals} Goals\n`;
  });

  repondre(topScorerMessage);
});

/** ✅ Premier League Top Assists */
hango({
  nomCom: "epl_top_assist",
  categorie: "football live",
  reaction: "🎯"
}, async (dest, hn, commandOptions) => {
  const { repondre } = commandOptions;

  // API URL for Premier League top assists
  const topAssistUrl = `${apiUrl}/PL/assists`;

  const data = await fetchFootballData(topAssistUrl);
  if (!data || !data.assists) {
    return repondre("❌ Error fetching EPL top assists.");
  }

  const topAssists = data.assists;
  let topAssistMessage = "🎯 *EPL Top Assists*\n";
  topAssists.forEach((assist, index) => {
    topAssistMessage += `${index + 1}. ${assist.player.name} - ${assist.numberOfAssists} Assists\n`;
  });

  repondre(topAssistMessage);
});

/** ✅ Premier League News */
hango({
  nomCom: "epl_news",
  categorie: "football live",
  reaction: "📰"
}, async (dest, hn, commandOptions) => {
  const { repondre } = commandOptions;

  // API URL for Premier League news (You may need to use another news API for this)
  const newsUrl = `https://newsapi.org/v2/everything?q=Premier+League&apiKey=YOUR_NEWSAPI_KEY`; // Replace with your NewsAPI key

  try {
    const response = await axios.get(newsUrl);
    if (response.data.status !== "ok") return repondre("❌ Error fetching EPL news.");

    let newsMessage = "📰 *EPL News*\n";
    response.data.articles.forEach((article, index) => {
      newsMessage += `${index + 1}. [${article.title}](${article.url})\n`;
    });

    repondre(newsMessage);
  } catch (error) {
    console.error(error);
    repondre("❌ Error fetching EPL news.");
  }
});

/** ✅ EPL Highlights (You can integrate video highlight API) */
hango({
  nomCom: "epl_highlights",
  categorie: "football live",
  reaction: "📺"
}, async (dest, hn, commandOptions) => {
  const { repondre } = commandOptions;

  // Example placeholder for video highlights (Consider using a video API)
  const highlightsUrl = `https://api.example.com/epl-highlights`; // Replace with actual highlight API

  try {
    const response = await axios.get(highlightsUrl);
    if (!response.data.highlights) return repondre("❌ No highlights found.");

    let highlightsMessage = "🎬 *EPL Highlights*\n";
    response.data.highlights.forEach((highlight, index) => {
      highlightsMessage += `${index + 1}. [Watch Highlight](${highlight.url})\n`;
    });

    repondre(highlightsMessage);
  } catch (error) {
    console.error(error);
    repondre("❌ Error fetching EPL highlights.");
  }
});
