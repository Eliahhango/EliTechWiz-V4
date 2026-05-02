const { hango } = require("../framework/hango");
const { getJson } = require("../framework/utils");
const axios = require("axios");

hango({
  nomCom: "movie",
  desc: "Gives you info about movies",
  categorie: "fun",
}, async (origineMessage, hn, context) => {
  const { repondre, ms, arg } = context;
  
  if (!arg[0]) {
    repondre('*Give me a movie name* 🎃');
    return;
  }
  
  const movieTitle = arg.join(" ");
  try {
    const response = await axios.get(
      `http://www.omdbapi.com/?apikey=742b2d09&t=${encodeURIComponent(movieTitle)}&plot=full`
    );

    if (response.data.Response !== 'True') {
      repondre('*Not found*');
      return;
    }

    let msg = '';
    const url = response.data.Poster;
    delete response.data.Poster;
    delete response.data.Response;
    delete response.data.Ratings;

    for (const data in response.data) {
      if (response.data[data] !== 'N/A') {
        msg += `*${data} :* ${response.data[data]}\n`;
      }
    }

    if (url === 'N/A') {
      repondre(msg.trim());
    } else {
      await hn.sendMessage(origineMessage.from, { image: { url }, caption: msg.trim() });
    }
  } catch (error) {
    repondre('Erreur lors de la récupération des informations du film.');
  }
});
