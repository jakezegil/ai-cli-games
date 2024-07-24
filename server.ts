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
    model: "gpt-4o-mini",
  });

  const data = chatCompletion.choices[0].message.content;

  // parse the code from the message
  const code = data && data.split("```typescript")[1].split("```")[0];

  // write it to a file
  fs.writeFileSync(`games/${(game as string).replace(" ", "_")}.ts`, code || "");

  return res.json({ data });
});

app.listen(3003, () => {
  console.log("Generating fun little cli games on port 3003!");
});
