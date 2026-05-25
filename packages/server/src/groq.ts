import { Groq } from "groq-sdk/client.js";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

import { readFileSync, unlinkSync } from "fs";

export async function summarizeTranscription() {
  const transcription = readFileSync("transcript.txt", "utf8");
  const summarizationPrompt = readFileSync(
    "packages/server/src/summarization_prompt.txt",
    "utf8",
  );

  unlinkSync("transcript.txt");

  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: summarizationPrompt,
      },
      {
        role: "user",
        content: transcription,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
}
