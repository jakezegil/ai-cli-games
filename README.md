## Set Up
copy env file over - `cp .env.mock .env`

-> update the .env with your open ai key

install bun (https://bun.sh)

## 1) Set up server 2) Generate Game 3) Run Game

```sh
bun server.ts
curl "http://localhost:3003/generate?game=your_game"
bun games/your_game.ts
```

Best games so far:
- games/hangman_with_random_words_from_the_internet.ts
- games/number_guesser.ts
- games/pong.ts