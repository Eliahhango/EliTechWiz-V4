const { hango } = require('../framework/hango');
const traduire = require("../framework/traduction") ;
const { default: axios } = require('axios');
const text2prompt = require('../framework/text2prompt')
const { ai } = require('../framework/mesfonctions')
const { react } = require('../framework/utils')
const conf = require('../set');

/**
 * ═══════════════════════════════════════════════════
 *            ELITECHWIZ AI ASSISTANT MODELS (V2)
 * ═══════════════════════════════════════════════════
 */

// ╔═════════════════════════════════════════════════╗
// ║              ELIAH AI ASSISTANT                 ║
// ╚═════════════════════════════════════════════════╝

hango({
  nomCom: "eliah",
  reaction: "🤖",
  categorie: "Ai"
}, async (dest, hn, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;
  
  if (!arg || !arg[0]) {
    return repondre(`╔══「 🤖 *EliTechWiz AI Assistant* 」══╗\n\n📱 Need help? Ask me anything!\n\nExample: .eliah tell me about space\n\n╚═══════════════════╝`);
  }

  try {
    // Show processing message
    await repondre("🔍 *Processing your request...*");
    
    // Translate user input to English for better results
    const message = await traduire(arg.join(' '), { to: 'en' });
    console.log("Translated query:", message);
    
    // Make request to BrainShop AI
    const response = await fetch(`http://api.brainshop.ai/get?bid=182418&key=UQXAO1yyrPLRnhf6&uid=[uid]&msg=${encodeURIComponent(message)}`);
    
    if (!response.ok) {
      throw new Error(`BrainShop API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.cnt) {
      // Format the response with decorative elements
      const formattedResponse = `╔══「 🤖 *EliTechWiz Eliah* 」══╗\n\n${data.cnt}\n\n╚═══════════════════╝`;
      repondre(formattedResponse);
    } else {
      throw new Error("Invalid response from BrainShop API");
    }
  } catch (error) {
    console.error("Eliah Error:", error.message || error);
    repondre("❌ *Error:* The AI service is currently unavailable. Please try again later.");
  }
});

// ╔═════════════════════════════════════════════════╗
// ║              DALLE IMAGE GENERATOR (V2)         ║
// ╚═════════════════════════════════════════════════╝

hango({ 
  nomCom: "dalle2", 
  reaction: "🎨", 
  categorie: "Ai" 
}, async (dest, hn, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    if (!arg || arg.length === 0) {
      return repondre(`╔══「 🎨 *DALLE Image Generator* 」══╗\n\n💬 Please provide a description for the image you want to create.\n\nExample: .dalle2 a cat riding a bicycle\n\n╚═══════════════════╝`);
    }

    // Show processing message
    await repondre("🖌️ *Generating your masterpiece...*");

    // Gather the arguments in a single string
    const prompt = arg.join(' ');
    
    // Call the AI image generation API
    const response = await axios.get(`http://api.maher-zubair.tech/ai/photoleap?q=${encodeURIComponent(prompt)}`);
    const data = response.data;
    
    // Create a branded caption
    let caption = `╔══「 🎨 *Image by EliTechWiz* 」══╗\n\n📝 Prompt: "${prompt}"\n\n╚═══════════════════╝`;
    
    if (data && data.status == 200 && data.result) {
      // Get the image URL from the API response
      const imageUrl = data.result;
      
      // Send the generated image with caption
      await hn.sendMessage(dest, { 
        image: { url: imageUrl }, 
        caption: caption 
      }, { quoted: ms });
    } else {
      repondre("❌ *Error:* Failed to generate the image. Please try a different description.");
    }
  } catch (error) {
    console.error('DALLE Error:', error.message || 'An error occurred');
    repondre("❌ *Error:* The image generation service is currently unavailable. Please try again later.");
  }
});

// ╔═════════════════════════════════════════════════╗
// ║              GPT ADVANCED (V2)                  ║
// ╚═════════════════════════════════════════════════╝

hango({ 
  nomCom: "gpt2", 
  reaction: "🧠", 
  categorie: "Ai" 
}, async (dest, hn, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  try {
    if (!arg || arg.length === 0) {
      return repondre(`╔══「 🧠 *GPT Advanced* 」══╗\n\n💬 Please ask a question or provide a prompt.\n\nExample: .gpt2 explain quantum computing\n\n╚═══════════════════╝`);
    }

    // Show processing message
    await repondre("🔍 *Processing your request...*");

    // Join the arguments into a single string
    const question = arg.join(' ');
    
    // Make request to the GPT API
    const response = await axios.get(`http://api.maher-zubair.tech/ai/chatgpt4?q=${encodeURIComponent(question)}`);
    const data = response.data;
    
    if (data && data.result) {
      // Format the response with decorative elements
      const formattedResponse = `╔══「 🧠 *EliTechWiz GPT* 」══╗\n\n${data.result}\n\n╚═══════════════════╝`;
      repondre(formattedResponse);
    } else {
      repondre("❌ *Error:* Failed to generate a response. Please try again with a different query.");
    }
  } catch (error) {
    console.error('GPT Error:', error.message || 'An error occurred');
    repondre("❌ *Error:* The AI service is currently unavailable. Please try again later.");
  }
});

// ╔═════════════════════════════════════════════════╗
// ║              GPT-4 TURBO                        ║
// ╚═════════════════════════════════════════════════╝

hango({
  nomCom: 'gpt4',
  reaction: '🚀',
  alias: ['chatgpt4'],
  categorie: 'Ai'
}, async (dest, hn, commandeOptions) => {
  const { ms, arg, repondre } = commandeOptions;
  
  if (!arg[0]) {
    return await repondre(`╔══「 🚀 *GPT-4 Turbo* 」══╗\n\n💬 Please ask a question or provide a prompt.\n\nExample: .gpt4 write a poem about technology\n\n╚═══════════════════╝`);
  }
  
  try {
    // Show typing indicator with a temporary message
    const msg = await hn.sendMessage(dest, { text: '🧠 *Thinking deeply...*' }, { quoted: ms });
    
    // Call the AI function from mesfonctions
    const res = await ai(arg.join(' '));
    
    if (res.status === 200) {
      // Format the successful response
      const formattedReply = `╔══「 🚀 *GPT-4 Turbo* 」══╗\n\n${res.reply}\n\n╚═══════════════════╝`;
      
      // Edit the previous message with the response
      await hn.sendMessage(dest, { text: formattedReply, edit: msg.key }, { quoted: ms });
      
      // React to the message
      await react(dest, hn, ms, '🤖');
    } else {
      // Edit the message with an error if the AI call failed
      await hn.sendMessage(dest, { 
        text: "❌ *Error:* Failed to generate a response. Please try again later.", 
        edit: msg.key 
      }, { quoted: ms });
      
      // React with warning
      await react(dest, hn, ms, '⚠️');
    }
  } catch (error) {
    console.error('GPT-4 Error:', error.message || 'An error occurred');
    repondre("❌ *Error:* The AI service is currently unavailable. Please try again later.");
  }
});

// ╔═════════════════════════════════════════════════╗
// ║              TEXT TO PROMPT CONVERTER           ║
// ╚═════════════════════════════════════════════════╝

hango({
  nomCom: "text2prompt",
  reaction: "✨",
  categorie: "Ai"
}, async (dest, hn, commandeOptions) => {
  const { ms, arg, repondre } = commandeOptions;
  
  if (!arg[0]) {
    return await repondre(`╔══「 ✨ *Text to Prompt* 」══╗\n\n💬 Please provide text to convert into an AI image prompt.\n\nExample: ${conf.PREFIXE}text2prompt a sad cat\n\n╚═══════════════════╝`);
  }
  
  try {
    // Show processing message
    await repondre("✨ *Converting your text to a detailed prompt...*");
    
    // Translate input to English for better results
    const text = await traduire(arg.join(' '), { to: 'en' });
    
    // Call the text2prompt function
    const result = await text2prompt(text);
    
    if (result && result.status && result.prompt) {
      // Format the result in a decorative box
      const formattedPrompt = `╔══「 ✨ *Enhanced Prompt* 」══╗\n\n📝 Original: "${text}"\n\n✨ *Enhanced:*\n${result.prompt}\n\n╚═══════════════════╝`;
      repondre(formattedPrompt);
    } else {
      repondre("❌ *Error:* Failed to generate an enhanced prompt. Please try again with different text.");
    }
  } catch (error) {
    console.error(`Text2Prompt Error: ${error}`);
    repondre("❌ *Error:* The prompt generation service is currently unavailable. Please try again later.");
  }
});

module.exports = {
  // Export any functions or variables that might be used elsewhere
};
