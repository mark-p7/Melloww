require("dotenv").config(); // Load environment variables from .env file
const axios = require("axios");

async function getCssColorFromMood(journalDescription) {
  const systemMessage =
    "You will be given a short journal entry reflecting a person's mood. Based on the emotion conveyed—be it joy, sadness, calmness, love, energy, anxiety, or hope—your task is to generate a pastel hex code that embodies this mood. Consider the following associations: \n" +
    "+ Joy: pastels like yellow(#ffec85) or light orange(#ffcc99).\n" +
    "+ Sadness: Subdued pastels like light blue or pale gray.\n" +
    "+ Calmness: Soothing pastels like mint green or sky blue.\n" +
    "+ Love: Tender pastels like pink or peach.\n" +
    "+ Energy: Vibrant pastels like coral or turquoise.\n" +
    "+ Anxiety: Muted pastels like dark gray or steel blue.\n" +
    "+ Hope: Uplifting pastels like light purple or cream.\n" +
    "Choose a pastel shade that aligns with the journal's emotional tone, ensuring the color's intensity and softness reflect the mood accurately.But remember not to have bright colors, only light and soft colors.";

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemMessage,
          },
          {
            role: "user",
            content: journalDescription,
          },
        ],
        temperature: 0.7,
        max_tokens: 64,
        top_p: 1,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    // Extract the hex code using a regular expression
    const hexCodeMatch = response.data.choices[0].message.content.match(
      /#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/
    );
    if (hexCodeMatch && hexCodeMatch[0]) {
      // Return the first matched hex code
      return hexCodeMatch[0];
    } else {
      throw new Error("No valid hex code found in the response");
    }
  } catch (error) {
    throw new Error(
      "Error fetching CSS color from mood description: " + error.message
    );
  }
}

// // Testing with example mood description
// getCssColorFromMood("my mother scolded me today. im angry")
//   .then((hexCode) => {
//     console.log(hexCode);
//   })
//   .catch((error) => {
//     console.error(error.message);
//   });

module.exports = { getCssColorFromMood };
