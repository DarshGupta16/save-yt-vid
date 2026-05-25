import { Hono } from "hono";
import { exec } from "child_process";
import { promisify } from "util";
import { readFileSync, writeFileSync } from "fs";
import { sleep } from "bun";
import { summarizeTranscription } from "./groq";
import { configDotenv } from "dotenv";

configDotenv();

const execAsync = promisify(exec);
const app = new Hono();

interface QueueLinkObject {
  url: string;
  mode: "api" | "whisper";
}

const queueFileAddress = "src/queue.json";
const errorLogFileAddress = "error.log";

const data = readFileSync(queueFileAddress, "utf8");
let queue = JSON.parse(data).queue as QueueLinkObject[];
let processing = false;

// ------------------------- Hono Router -------------------------
app.get("/save-video", (c) => {
  try {
    const url = c.req.query("url");
    const mode: "api" | "whisper" =
      (c.req.query("mode") as "api" | "whisper") || "api";

    if (url) queue.push({ url, mode });
    else throw "url param not provided!";

    writeFileSync(queueFileAddress, JSON.stringify({ queue }));
    processNext();
    return c.json({ queued: true });
  } catch (error) {
    return c.json({ queued: false, error });
  }
});

export default app;

// ------------------------- Queue Processing -------------------------
const processNext = async () => {
  if (processing) return;
  if (queue.length === 0) return;

  processing = true;
  // ------------------------- All processing work here -------------------------
  console.log(`processing ${queue[0].url} with mode ${queue[0].mode}`);

  // Get transcription
  console.log("Getting transcription...");
  const { stderr, stdout } = await execAsync(
    `python packages/server/src/transcribe_${queue[0].mode}.py`,
  );
  if (stderr) {
    console.error(`Error processing ${queue[0].url}:`, stderr);
    writeFileSync(
      errorLogFileAddress,
      `${new Date().toISOString()}: Error processing ${queue[0].url}: ${stderr}\n`,
      { flag: "a" },
    );
  }

  console.log(stdout);

  // Send to Groq for summary
  console.log("Sending to Groq for retrieving summary...");
  const summaryChatCompletion = await summarizeTranscription();
  const summary = summaryChatCompletion.choices[0].message.content;
  console.log("Summary retrieved from Groq:", summary);

  // Save summary to file
  console.log("Saving summary to file...");
  writeFileSync(
    `/home/spacexdragon7/myfolder/Obsidian/Space\'s Vault/00 Uncategorized/${new Date().toDateString().replace(/\s/g, "_")}_${queue[0].url.split("v=")[1]}.md`,
    summary as string,
  );
  // ------------------------- Finished processing -------------------------
  console.log(`Finished processing ${queue[0].url}`);
  processing = false;
  queue.shift();
  writeFileSync(queueFileAddress, JSON.stringify({ queue }));

  processNext();
};
processNext();
