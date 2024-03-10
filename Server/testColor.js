require("dotenv").config(); // Load environment variables from .env file
const axios = require("axios");

async function getCssColorFromMood(moodDescription) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              'You will be provided with a description of a short journal entry of a person, and your task is to generate the CSS code for a pastel color that matches it. Write your output in json with a single key called "css_code".Keep in mind that the description should match the color.',
          },
          {
            role: "user",
            content: moodDescription,
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
    // Assuming the response is in the correct format, directly returning it.
    // You might want to add error checking or formatting here as necessary.
    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error("Error fetching CSS color from mood description");
  }
}

// Test with the mood description "Blue sky at dusk."
getCssColorFromMood(
  "Today was a good day. I felt productive and accomplished all my tasks."
)
  .then((cssCode) => {
    console.log(cssCode); // Log the resulting CSS code
  })
  .catch((error) => {
    console.error(error.message); // Log any errors
  });
