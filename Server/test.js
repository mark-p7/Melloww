require("dotenv").config(); // Load environment variables from .env file

const axios = require("axios");

// Function to submit a journal entry to the OpenAI API and retrieve mental health tips
async function getMentalHealthTips(journalText) {
  try {
    const prompt = `As Mellow, your friend, I'm here to listen and help. After reading your thoughts: "${journalText}" I want to provide a heartfelt, concise mental health tip in about 2 sentences, as a real friend would.`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            // content:
            //   journalText +
            //   " Respond with empathy like a real friend would and provide a heartfelt, concise mental health tip in about 2 sentences.",
            content: prompt,
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

// Sample journal entries for testing
const journalEntries = [
  "Today was a good day. I felt productive and accomplished all my tasks.",
  "Feeling a bit overwhelmed with work lately. Need to find a way to manage stress better.",
  "I miss spending time with friends and family. Feeling lonely.",
];

// Function to submit each journal entry and receive mental health tips
async function processJournalEntries() {
  for (let i = 0; i < journalEntries.length; i++) {
    const entry = journalEntries[i];
    console.log(`Journal Entry ${i + 1}: ${entry}`);
    try {
      const tips = await getMentalHealthTips(entry);
      console.log("Mental Health Tips:", tips);
    } catch (error) {
      console.error("Error processing journal entry:", error.message);
    }
  }
}

// Call the function to process journal entries
processJournalEntries();
