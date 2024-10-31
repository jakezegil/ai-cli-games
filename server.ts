import OpenAI from "openai";
import fs from "fs";
import express, { Request } from "express";

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: apiKey,
});

const app = express();

app.get("/generate", async (req: Request<{ game: string }>, res) => {
  const game = req.query.game;

  if (!game) return res.status(400).json({ error: "Please provide a game." });

  const model = "gpt-4o";

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "assistant",
        content:
          "I am a code monkey." +
          " I'll make you a kickass cli game to develop. I won't give you anything other than the code, which you can pipe directly into a single file and execute to play." +
          " My games will be complete with a main loop, input handling, and a render function." +
          " What do you want me to make?",
      },
      {
        role: "user",
        content: `Make me a ${game} game in typescript.`,
      },
    ],
    model: model,
  });

  const data = chatCompletion.choices[0].message.content;

  // parse the code from the message
  const code = data && data.split("```typescript")[1].split("```")[0];
  const prefix = `//generated with ${model}\n\n`;

  // write it to a file
  fs.writeFileSync(
    `games/${(game as string).replace(" ", "_")}.ts`,
    `${prefix}${code || ""}`
  );

  return res.json({
    data: `${game} game at \`bun games/${game}.ts\``,
  });
});

app.get("/turbocharge", async (req: Request<{ game: string }>, res) => {
  const game = req.query.game;

  if (!game) return res.status(400).json({ error: "Please provide a game." });

  const model = "gpt-4o";

  const file = fs.readFileSync(`games/${game}.ts`, "utf8");

  const prompt = `
  You are a code monkey.
  You are given a cli game in typescript.
  You are asked to turbocharge the game by adding more features.

  GAME LOGIC:
  ${file}

  TASK:
  Make this game insanely cracked. Crazy. Insane. Max out the features. Max out the fun. Turbocharge this baby.
  `;

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: `Make me a ${game} game in typescript.`,
      },
    ],
    model: model,
  });

  const data = chatCompletion.choices[0].message.content;

  // parse the code from the message
  const code = data && data.split("```typescript")[1].split("```")[0];
  const prefix = `//generated with ${model}\n\n`;

  // write it to a file
  fs.writeFileSync(
    `games/${(game as string).replace(" ", "_")}.ts`,
    `${prefix}${code || ""}`
  );

  return res.json({ data });
});

app.listen(3003, () => {
  console.log("Generating fun little cli games on port 3003!");
});
