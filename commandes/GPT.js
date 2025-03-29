hango({
  nomCom: "elitechwiz",
  categorie: "Ai",
  reaction: "🤖"
}, async (dest, hn, commandeOptions) => {
  const { arg, repondre, ms } = commandeOptions;
  
  if (!arg || arg.length === 0) {
    repondre("Please provide a question or prompt for ChatGPT.\n*Example: .gpt What is artificial intelligence?*");
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY; // Make sure to set this in your environment variables
  
  if (!apiKey) {
    repondre("OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.");
    return;
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user",
          content: arg.join(" ")
        }],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const answer = response.data.choices[0].message.content.trim();
    
    let message = `🤖 *ChatGPT Response*\n\n`;
    message += `*Question:* ${arg.join(" ")}\n\n`;
    message += `*Answer:* ${answer}`;
    
    repondre(message);
  } catch (error) {
    console.error('ChatGPT API error:', error);
    repondre("❌ An error occurred while getting a response from ChatGPT. Please try again later.");
  }
});
