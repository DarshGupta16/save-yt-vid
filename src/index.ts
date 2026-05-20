import { Hono } from "hono";
import { exec } from "child_process";
import { promisify } from "util";
import { readFileSync, writeFileSync } from "fs";
import { sleep } from "bun";

const execAsync = promisify(exec);
const app = new Hono();

const data = readFileSync("queue.json", "utf8");
let queue = JSON.parse(data).queue as string[];
let processing = false;

app.get("/save-video", (c) => {
  try {
    const url = c.req.query("url");

    if (url) queue.push(url);
    else throw "url param not provided!";

    writeFileSync("queue.json", JSON.stringify({ queue }));
    processNext();
    return c.json({ queued: true });
  } catch (error) {
    return c.json({ queued: false, error });
  }
});

const processNext = async () => {
  if (processing) return;
  if (queue.length === 0) return;

  processing = true;
  // All processing work here
  console.log(`processing ${queue[0]}`);
  await sleep(10000);
  // Finished processing
  processing = false;
  queue.shift();
  writeFileSync("queue.json", JSON.stringify({ queue }));

  processNext();
};

export default app;
