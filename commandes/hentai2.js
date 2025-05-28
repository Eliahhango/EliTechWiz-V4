const {hango } = require("../framework/hango");
const axios = require('axios');


hango({
  nomCom: "ass",
  categorie: "Hentai",
  reaction: "🙄"
},
async (origineMessage, hn, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  const url = 'https://shizoapi.onrender.com/api/nsfw/ass?apikey=shizo'; // Remplace avec ton lien réel

  try { for (let i = 0 ; i < 5 ; i++ ) {
    const response = await axios.get(url);
    const imageUrl = response.data.url;

    hn.sendMessage(origineMessage, { image: { url: imageUrl } }, { quoted: ms }); }
  } catch (error) {
    repondre('Erreur lors de la récupération des données : ' +error);
  }
});
hango({
  nomCom: "masterbation",
  categorie: "Hentai",
  reaction: "🙄"
},
async (origineMessage, hn, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  const url = 'https://shizoapi.onrender.com/api/nsfw/masterbation?apikey=shizo'; // Remplace avec ton lien réel

  try { for (let i = 0 ; i < 5 ; i++ ) {
    const response = await axios.get(url);
    const imageUrl = response.data.url;

    hn.sendMessage(origineMessage, { image: { url: imageUrl } }, { quoted: ms }); }
  } catch (error) {
    repondre('Erreur lors de la récupération des données : ' +error);
  }
});
hango({
  nomCom: "thigh",
  categorie: "Hentai",
  reaction: "🙄"
},
async (origineMessage, hn, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  const url = 'https://shizoapi.onrender.com/api/nsfw/thigh?apikey=shizo'; // Remplace avec ton lien réel

  try { for (let i = 0 ; i < 5 ; i++ ) {
    const response = await axios.get(url);
    const imageUrl = response.data.url;

    hn.sendMessage(origineMessage, { image: { url: imageUrl } }, { quoted: ms }); }
  } catch (error) {
    repondre('Erreur lors de la récupération des données : ' +error);
  }
});
hango({
  nomCom: "panty",
  categorie: "Hentai",
  reaction: "🙄"
},
async (origineMessage, hn, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  const url = 'https://shizoapi.onrender.com/api/nsfw/panty?apikey=shizo'; // Remplace avec ton lien réel

  try { for (let i = 0 ; i < 5 ; i++ ) {
    const response = await axios.get(url);
    const imageUrl = response.data.url;

    hn.sendMessage(origineMessage, { image: { url: imageUrl } }, { quoted: ms }); }
  } catch (error) {
    repondre('Erreur lors de la récupération des données : ' +error);
  }
});
