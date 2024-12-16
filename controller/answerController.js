import openai from "../config/openai.js";

async function getBestAnswer(question, answers) {
  try {
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo",
      prompt: generatePrompt(question, answers),
      max_tokens: 100,
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('OpenAI error:', error);
    return "Sorry, I couldn't find a suitable answer.";
  }
}

function generatePrompt(question, answers) {
  return `Given the following question: "${question}", select the most appropriate answer from the list below:\n${answers.map((answer, index) => `${index + 1}. ${answer.text}`).join('\n')}\nAnswer:`;
}

export { getBestAnswer };
