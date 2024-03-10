require("dotenv").config(); // Load environment variables from .env file

const axios = require("axios");

// Function to submit a journal entry to the OpenAI API and retrieve mental health tips
async function getMentalHealthTips(journalText) {
  try {
    const prompt = `As Mellow, your friend, I'm here to listen and help. After reading your thoughts: I want to provide a heartfelt, concise mental health tip in about a sentence, as a real friend would.`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: prompt,
          },
          {
            role: "user",
            content: journalText,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    const tips = response.data.choices[0].message.content;
    return tips;
  } catch (error) {
    throw new Error("Error fetching mental health tips from OpenAI API");
  }
}

module.exports = { getMentalHealthTips };
