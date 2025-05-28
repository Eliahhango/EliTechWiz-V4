const { hango } = require("../framework/hango");
const traduire = require("../framework/traduction");
const s = require("../set");
const axios = require("axios");

// ╔═════════════════════════════════════════════════╗
// ║              BOT AI COMMAND                     ║
// ╚═════════════════════════════════════════════════╝

hango({
  nomCom: "bot",
  reaction: "📡",
  categorie: "IA"
}, async (dest, hn, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  if (!arg || !arg[0]) {
    return repondre("Veuillez poser une questions.");
  }

  try {
    // Translate user input to English for better results
    const translatedQuery = await traduire(arg.join(" "), { to: "en" });
    console.log(translatedQuery);

    // Make request to BrainShop AI
    const brainShopUrl = `http://api.brainshop.ai/get?bid=177607&key=NwzhALqeO1kubFVD&uid=[uid]&msg=${translatedQuery}`;
    
    fetch(brainShopUrl)
      .then(response => response.json())
      .then(data => {
        const botResponse = data.cnt;
        console.log(botResponse);
        
        // Translate response back to French
        traduire(botResponse, { to: "fr" })
          .then(translatedResponse => {
            repondre(translatedResponse);
          })
          .catch(error => {
            console.error("Erreur lors de la traduction en français :", error);
            repondre("Erreur lors de la traduction en français");
          });
      })
      .catch(error => {
        console.error("Erreur lors de la requête à BrainShop", error);
        repondre("Erreur lors de la requête à BrainShop");
      });
  } catch (error) {
    repondre("oupsaa une erreur : " + error);
  }
});

// ╔═════════════════════════════════════════════════╗
// ║              DALLE IMAGE COMMAND                ║
// ╚═════════════════════════════════════════════════╝

hango({
  nomCom: "dalle",
  reaction: "💎",
  categorie: "IA"
}, async (dest, hn, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    if (!arg || arg.length === 0) {
      return repondre("Veuillez entrer les informations nécessaires pour générer l'image.");
    }

    const prompt = arg.join(" ");
    
    // Call the AI image generation API
    const response = await axios.get(`https://api.maher-zubair.tech/ai/photoleap?q=${prompt}`);
    const responseData = response.data;

    // Add branding message
    let caption = "*Propulsé par ELITECHWIZ*";

    // Check if the API returned a valid result with an image URL
    if (responseData.status && responseData.result) {
      const imageUrl = responseData.result;
      
      // Send the generated image
      await hn.sendMessage(dest, {
        image: { url: imageUrl },
        caption: caption
      }, { quoted: ms });
    } else {
      repondre("Erreur lors de la génération de l'image");
    }
  } catch (error) {
    console.error("Erreur:", error.message || "Une erreur s'est produite");
    repondre("Oups, une erreur est survenue lors du traitement de votre demande.");
  }
});

// ╔═════════════════════════════════════════════════╗
// ║              GPT COMMAND                        ║
// ╚═════════════════════════════════════════════════╝

hango({
  nomCom: "gpt",
  reaction: "🌐",
  categorie: "IA"
}, async (dest, hn, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    if (!arg || arg.length === 0) {
      return repondre("Nambie Nakusikiliza Mkuu Unasemaje 🤔 ' ");
    }

    const query = arg.join(" ");
    
    // Make request to ChatGPT API
    const response = await axios.get(`https://api.maher-zubair.tech/ai/chatgpt4?q=${query}`);
    const responseData = response.data;

    // Check if we got a valid response
    if (responseData) {
      repondre(responseData.result);
    } else {
      repondre("Erreur lors de la génération de la reponse");
    }
  } catch (error) {
    console.error("Erreur:", error.message || "Une erreur s'est produite");
    repondre("Oups, une erreur est survenue lors du traitement de votre demande.");
  }
});

// ╔═════════════════════════════════════════════════╗
// ║              CHAT COMMAND                       ║
// ╚═════════════════════════════════════════════════╝

hango({
  nomCom: "chat",
  reaction: "🤔",
  categorie: "IA"
}, async (dest, hn, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  if (!arg || !arg[0]) {
    return repondre("Veuillez poser une questions.");
  }

  try {
    // Translate user input to English for better results
    const translatedQuery = await traduire(arg.join(" "), { to: "en" });
    console.log(translatedQuery);

    // Make request to BrainShop AI
    const brainShopUrl = `http://api.brainshop.ai/get?bid=177607&key=NwzhALqeO1kubFVD&uid=[uid]&msg=${translatedQuery}`;
    
    fetch(brainShopUrl)
      .then(response => response.json())
      .then(data => {
        const botResponse = data.cnt;
        console.log(botResponse);
        
        // Keep response in English
        traduire(botResponse, { to: "en" })
          .then(translatedResponse => {
            repondre(translatedResponse);
          })
          .catch(error => {
            console.error("Erreur lors de la traduction en français :", error);
            repondre("Erreur lors de la traduction en français");
          });
      })
      .catch(error => {
        console.error("Erreur lors de la requête à BrainShop", error);
        repondre("Erreur lors de la requête à BrainShop");
      });
  } catch (error) {
    repondre("oupsaa une erreur : " + error);
  }
});

// ╔═════════════════════════════════════════════════╗
// ║              MATH CALCULATION COMMAND           ║
// ╚═════════════════════════════════════════════════╝

hango({
  nomCom: "calcul",
  reaction: "😂",
  categorie: "IA"
}, async (dest, hn, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  if (!arg || arg.length === 0) {
    return repondre("Please insert maths calculations like 1000*2.");
  }

  try {
    const calculation = arg.join(" ");
    
    // Call the math solver API
    const response = await fetch(`https://api.maher-zubair.tech/ai/mathssolve?q=${calculation}`);
    const mathResult = await response.json();
    
    // Send the calculation result
    await repondre(mathResult.result);
    console.log(mathResult.completion);
  } catch (error) {
    console.error("Math calculation error:", error);
    repondre("Error solving the math problem. Please check your input and try again.");
  }
});
