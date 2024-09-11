
//legacy version code
// import { GoogleGenerativeAI, GoogleGenerativeAIFetchError } from "@google/generative-ai";
// import { GoogleGenerativeAIStream, StreamingTextResponse } from "ai";

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// export async function POST(req: Request) {
//   try {
//     const prompt =
//     "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

//   // Ask Google Generative AI for a streaming completion given the prompt
//   const response = await genAI
//     .getGenerativeModel({ model: "gemini-1.5-flash-latest" })
//     .generateContentStream({
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//     });

//   // Convert the response into a friendly text-stream
//   const stream = GoogleGenerativeAIStream(response);

//   // Respond with the stream
//   return new StreamingTextResponse(stream);
//   } catch (error) {
//     if(error instanceof GoogleGenerativeAIFetchError) {
//       const {status, statusText, message, errorDetails } = error
//       return Response.json({status, statusText, message, errorDetails}, {status})
//     }
//     console.error("An unexpected error ocurred", error)
//     throw error;
//   }
// }

//new version

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { GoogleGenerativeAIFetchError } from "@google/generative-ai";
import { streamText } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});

export async function POST(request: Request) {
  try {
    const result = await streamText({
      model: google("models/gemini-1.5-flash-latest", {
        safetySettings: [
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_LOW_AND_ABOVE",
          },
        ],
      }),
      prompt:
        "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.",
    });

    return result.toDataStreamResponse();
  } catch (error) {
    if (error instanceof GoogleGenerativeAIFetchError) {
      const { status, statusText, errorDetails, message } = error;
      return Response.json(
        {
          status,
          statusText,
          errorDetails,
          message,
        },
        { status }
      );
    }
    console.error("Unexpected error ocurred!", error);
    throw error;
  }
}
