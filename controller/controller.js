import answerSchema from "../models/answerSchema.js";
import questionSchema from "../models/questionSchema.js";
import genAI from "../config/googleAi.js";
import messageSchema from "../models/messageSchema.js";
import openai from "../config/openai.js";
export const botChat = async (req, res) => {
  const { message } = req.body;

  // Save the user question
  const newQuestion = new questionSchema({ text: message });
  await newQuestion.save();

  // Find the best matching answer
  const answers = await answerSchema.find({});
  let bestMatch = null;
  let highestMatchCount = 0;

  answers.forEach((answer) => {
    const matchCount = answer.keywords.reduce((count, keyword) => {
      if (message.toLowerCase().includes(keyword.toLowerCase())) {
        return count + 1;
      }
      return count;
    }, 0);

    if (matchCount > highestMatchCount) {
      highestMatchCount = matchCount;
      bestMatch = answer;
    }
  });

  // Respond with the best match or a default message
  const botResponse = bestMatch
    ? bestMatch.text
    : "I'm sorry, I don't understand that. Can you please rephrase?";

  res.json({ botResponse });
};

// add answer section

export const addAnswer = async (req, res) => {
  const { text } = req.body;
  console.log("hello");

  if (!text) {
    return res.status(400).json({ error: "Answer text is required" });
  }

  const newAnswer = new answerSchema({ text });
  await newAnswer.save();

  res.status(201).json(newAnswer);
};

export const GetAnswer = async (req, res) => {
  try {
    console.log("Hello");
    const answers = await answerSchema.find();
    res.status(200).json(answers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch answers" });
  }
};

export const DeleteAnswer = async (req, res) => {
  try {
    console.log("Hello");
    const { id } = req.params;
    const deletedAnswer = await answerSchema.findByIdAndDelete(id);
    
    if (!deletedAnswer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    res.status(200).json({ message: "Answer deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete answer" });
  }
};

export const UpdateAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    console.log(id , text)

    const updatedAnswer = await answerSchema.findByIdAndUpdate(id, { text }, { new: true });
    
    if (!updatedAnswer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    res.status(200).json(updatedAnswer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update answer" });
  }
};



// export const askQuestions = async (req, res) => {

//     const { message } = req.body;
//         try {
//         const answers = await answerSchema.find();
//         const bestAnswer = await getBestAnswer(message, answers);

//         if (bestAnswer) {
//           res.json({ answer: bestAnswer });
//         } else {
//           res.status(404).json({ error: 'No suitable answer found' });
//         }
//       } catch (err) {
//         res.status(500).json({ error: err.message });
//       }
// }

// let conversationHistory = [
//   {role :"system",content :"You are a helpful assistant"}
// ]
// export const askQuestions = async (req, res) => {
//   const { message } = req.body;
//   conversationHistory.push({ role: "user", content: message });

//   try {
//     const completions = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: conversationHistory,
//     });

//     const botResponse = completions.choices[0].message.content;
//     res.json({ message: botResponse });

//   } catch (error) {
//     if (error.response && error.response.status === 429) {
//       res.status(429).json({ "error": "Quota exceeded. Please check your plan and billing details." });
//     } else {
//       res.status(500).json({ "error": error.message });
//     }
//   }
// };
// api
// export const askQuestions = async (req, res) => {
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//   const { message } = req.body;

//   try {
//     // Fetch all potential answers from the database
//     const answers = await answerSchema.find();

//     // Check if the message is a common greeting
//     const isGreeting =
//       message.toLowerCase().startsWith("hi") ||
//       message.toLowerCase().startsWith("hello") ||
//       message.toLowerCase().startsWith("hey");

//     if (isGreeting) {
//       // Respond with the welcome message only for pure greetings
//       return res.json({ message: "Hello! How can I assist you today?" });
//     }

//     // Generate the prompt based on available answers
//     const prompt = `The user asks: ${message}.
//     Provide the most relevant answer from the following options:
//     ${answers.map((answer, index) => `${index + 1}. ${answer.text}`).join('\n')}
//     If no answer is applicable, respond with the exact phrase: "This content is not available for this AI."`;

//     // If the prompt is valid, request an answer from Gemini AI
//     if (prompt) {
//       const result = await model.generateContent(prompt);
//       const response = await result.response;
//       let text = response.text().trim();

//       // Shorten the AI-generated answer using Gemini AI
//       const summaryPrompt = `From the text below, extract the most relevant answer in a clear and concise manner.
//       ${text.includes('<iframe') ? 'If an iframe link is explicitly mentioned within the answer, extract the iframe link and include it in the response.' : text.match(/https?:\/\/[^\s]+/) ? 'If any link is mentioned within the answer, extract the link and include it in the response.' : '.'}
//       "${text}"`;

//       const summaryResult = await model.generateContent(summaryPrompt);
//       const summaryResponse = await summaryResult.response;
//       let summaryText = summaryResponse.text().trim();

//       // Extract YouTube video link, if available
//       const youtubeLinkRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|\?feature=youtu.be\/))([\w-]{11})(?:[&\?\%\/\#]+)?/;
//       const youtubeLinks = summaryText.match(youtubeLinkRegex);

//       // Extract other links
//       const otherLinksRegex = /https?:\/\/[^\s]+/g;
//       const otherLinks = summaryText.match(otherLinksRegex);

//       let iframeLink = '';
//       if (youtubeLinks && youtubeLinks.length > 0) {
//         iframeLink = youtubeLinks[0];
//       }

//       // Remove all links from the summary text
//       const cleanedSummaryText = summaryText.replace(/https?:\/\/[^\s]+/g, '').trim();

//       // Prepare an array to hold all extracted links
//       const extractedLinks = otherLinks || [];

//       // Return the summarized AI-generated answer with the YouTube link in a separate field
//       return res.json({ message: cleanedSummaryText, iframe: iframeLink, links: extractedLinks });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

export const askQuestions = async (req, res) => {
  const { message } = req.body;

  try {
    // Fetch all potential answers from the database
    const answers = await answerSchema.find();

    // Check if the message is a common greeting
    const isGreeting =
      message.toLowerCase().startsWith("hi") ||
      message.toLowerCase().startsWith("hello") ||
      message.toLowerCase().startsWith("hey");

    if (isGreeting) {
      // Respond with the welcome message only for pure greetings
      return res.json({ message: "Hello! How can I assist you today?" });
    }

    // Generate the prompt based on available answers
    const prompt = `The user asks: "${message}". 
    Please select the most relevant and correct answer from the following options. Only respond with the best-matching answer without introducing any randomness:
    ${answers.map((answer, index) => `${index + 1}. ${answer.text}`).join("\n")}

    If no answer is applicable, respond with the exact phrase: "This content is not available for this AI."`;

    // Request an answer from OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // You can change this to the desired OpenAI model
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150, // Adjust based on your requirements
      temperature: 0, // Ensure deterministic results with no randomness
    });

    const text = response.choices[0].message.content.trim();

    // New summary prompt to ensure no data is omitted
    const summaryPrompt = `
    You are summarizing an important answer provided to the user. Follow these instructions to ensure the response is clear and accurate:
  
    1. Do not omit any critical information from the provided text.
    2. Remove all markdown or formatting characters (such as asterisks ** or underscores __) from the response.
    3. Ensure all amounts, breakdowns, and numerical data are accurately preserved.
    4. If the answer has multiple parts or sentences, ensure each part is shown on a new line.
    5. Separate multiple answers with line breaks, and show each in a numbered or bullet-point format (like 1., 2., 3.).
    6. If there are any URLs or external links, include them at the end of the response under a separate section labeled 'Links'. 
    7. If there is a YouTube video link, wrap it as an iframe code ready for embedding, and label the section 'YouTube Video'.
  
    Here is the text you need to summarize:
  
    "${text}"
  `;
  
  

    const summaryResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: summaryPrompt }],
      max_tokens: 150, // Adjust based on your requirements
      temperature: 0, // Ensure consistency in the summary
    });

    const summaryText = summaryResponse.choices[0].message.content.trim();

    // Extract YouTube video link, if available
    const youtubeLinkRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|\?feature=youtu.be\/))([\w-]{11})(?:[&\?\%\/\#]+)?/;
    const youtubeLinks = summaryText.match(youtubeLinkRegex);

    // Extract other links
    const otherLinksRegex = /https?:\/\/[^\s]+|www\.[^\s]+/g;
    const otherLinks = summaryText.match(otherLinksRegex);

    let iframeLink = "";
    if (youtubeLinks && youtubeLinks.length > 0) {
      iframeLink = youtubeLinks[0];
    }

    // Remove all links from the summary text
    const cleanedSummaryText = summaryText
      .replace(/https?:\/\/[^\s]+|www\.[^\s]+/g, "")
      .trim();

    // Prepare an array to hold all extracted links
    const extractedLinks = otherLinks || [];

    // Return the summarized AI-generated answer with the YouTube link in a separate field
    return res.json({
      message: cleanedSummaryText,
      iframe: iframeLink,
      links: extractedLinks,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



