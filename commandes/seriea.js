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

/** ✅ serieA standings */
hango({
  nomCom: "seriea",
  categorie: "football live",
  reaction: "⚽"
}, async (dest, hn, commandOptions) => {
  const { repondre } = commandOptions;

  // API URL for Serie A standings
  const standingsUrl = `${apiUrl}/SA/standings`;

  const data = await fetchFootballData(standingsUrl);
  if (!data || !data.standings) {
    return repondre("❌ Error fetching Serie A standings.");
  }

  const standings = data.standings[0].table;
  let standingsMessage = "📊 *Serie A Table*\n";
  standings.forEach((team, index) => {
    standingsMessage += `${index + 1}. ${team.team.name} - ${team.points} Points\n`;
  });

  repondre(standingsMessage);
});

/** ✅ serieA matchday */
hango({
  nomCom: "seriea_matchday",
  categorie: "football live",
  reaction: "📅"
}, async (dest, hn, commandOptions) => {
  const { repondre } = commandOptions;

  // API URL for upcoming Serie A matches
  const matchesUrl = `${apiUrl}/SA/matches`;

  const data = await fetchFootballData(matchesUrl);
  if (!data || !data.matches) {
    return repondre("❌ Error fetching Serie A matchday.");
  }

  const matches = data.matches;
  let matchdayMessage = "🗓️ *Upcoming Serie A Matches*\n";
  matches.forEach(match => {
    matchdayMessage += `${match.homeTeam.name} vs ${match.awayTeam.name} - ${match.utcDate}\n`;
  });

  repondre(matchdayMessage);
});

/** ✅ serieA top scorers */
hango({
  nomCom: "seriea_top_scorer",
  categorie: "football live",
  reaction: "⚽"
}, async (dest, hn, commandOptions) => {
  const { repondre } = commandOptions;

  // API URL for Serie A top scorers
  const topScorerUrl = `${apiUrl}/SA/scorers`;

  const data = await fetchFootballData(topScorerUrl);
  if (!data || !data.scorers) {
    return repondre("❌ Error fetching Serie A top scorers.");
  }

  const topScorers = data.scorers;
  let topScorerMessage = "🏆 *Serie A Top Scorers*\n";
  topScorers.forEach((scorer, index) => {
    topScorerMessage += `${index + 1}. ${scorer.player.name} - ${scorer.numberOfGoals} Goals\n`;
  });

  repondre(topScorerMessage);
});

/** ✅ serieA top assists */
hango({
  nomCom: "seriea_top_assist",
  categorie: "football live",
  reaction: "🎯"
}, async (dest, hn, commandOptions) => {
  const { repondre } = commandOptions;

  // API URL for Serie A top assists
  const topAssistUrl = `${apiUrl}/SA/assists`;

  const data = await fetchFootballData(topAssistUrl);
  if (!data || !data.assists) {
    return repondre("❌ Error fetching Serie A top assists.");
  }

  const topAssists = data.assists;
  let topAssistMessage = "🎯 *Serie A Top Assists*\n";
  topAssists.forEach((assist, index) => {
    topAssistMessage += `${index + 1}. ${assist.player.name} - ${assist.numberOfAssists} Assists\n`;
  });

  repondre(topAssistMessage);
});

/** ✅ serieA news */
hango({
  nomCom: "seriea_news",
  categorie: "football live",
  reaction: "📰"
}, async (dest, hn, commandOptions) => {
  const { repondre } = commandOptions;

  // API URL for Serie A news (You may need to use another news API for this)
  const newsUrl = `https://newsapi.org/v2/everything?q=Serie+A&apiKey=YOUR_NEWSAPI_KEY`; // Replace with your NewsAPI key

  try {
    const response = await axios.get(newsUrl);
    if (response.data.status !== "ok") return repondre("❌ Error fetching Serie A news.");

    let newsMessage = "📰 *Serie A News*\n";
    response.data.articles.forEach((article, index) => {
      newsMessage += `${index + 1}. [${article.title}](${article.url})\n`;
    });

    repondre(newsMessage);
  } catch (error) {
    console.error(error);
    repondre("❌ Error fetching Serie A news.");
  }
});

/** ✅ serieA highlights (You can integrate video highlight API) */
hango({
  nomCom: "seriea_highlights",
  categorie: "football live",
  reaction: "📺"
}, async (dest, hn, commandOptions) => {
  const { repondre } = commandOptions;

  // Example placeholder for video highlights (Consider using a video API)
  const highlightsUrl = `https://api.example.com/sa-highlights`; // Replace with actual highlight API

  try {
    const response = await axios.get(highlightsUrl);
    if (!response.data.highlights) return repondre("❌ No highlights found.");

    let highlightsMessage = "🎬 *Serie A Highlights*\n";
    response.data.highlights.forEach((highlight, index) => {
      highlightsMessage += `${index + 1}. [Watch Highlight](${highlight.url})\n`;
    });

    repondre(highlightsMessage);
  } catch (error) {
    console.error(error);
    repondre("❌ Error fetching Serie A highlights.");
  }
});
