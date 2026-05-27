import { Groq } from "groq-sdk/client.js";
import { readFileSync, unlinkSync } from "fs";
import { join } from "path";

let groq: Groq;
const packageRoot = join(import.meta.dir, "..");

export async function summarizeTranscription() {
  if (!groq) groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const transcription = readFileSync(join(packageRoot, "transcript.txt"), "utf8");
  const summarizationPrompt = readFileSync(
    join(packageRoot, "src/summarization_prompt.txt"),
    "utf8",
  );

  unlinkSync(join(packageRoot, "transcript.txt"));

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
