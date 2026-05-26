import { Groq } from "groq-sdk/client.js";
import { readFileSync, unlinkSync } from "fs";

let groq: Groq;

export async function summarizeTranscription() {
  if (!groq) groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const transcription = readFileSync("transcript.txt", "utf8");
  const summarizationPrompt = readFileSync(
    "src/summarization_prompt.txt",
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
