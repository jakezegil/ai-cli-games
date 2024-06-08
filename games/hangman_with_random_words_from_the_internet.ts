
import * as request from 'request-promise';
import * as readline from 'readline';

const wordUrl = 'https://random-word-api.herokuapp.com/word?number=1';

class HangmanGame {
  word: string;
  guessedLetters: Set<string>;
  maxTries: number;
  tries: number;

  constructor(word: string, maxTries: number) {
    this.word = word.toLowerCase();
    this.guessedLetters = new Set<string>();
    this.maxTries = maxTries;
    this.tries = 0;
  }

  get maskedWord() {
    return this.word
      .split('')
      .map(letter => (this.guessedLetters.has(letter) ? letter : '_'))
      .join('');
  }

  guessLetter(letter: string) {
    letter = letter.toLowerCase();
    if (!this.guessedLetters.has(letter)) {
      this.guessedLetters.add(letter);
      if (!this.word.includes(letter)) {
        this.tries++;
      }
    }
  }

  isGameOver() {
    return this.tries >= this.maxTries || this.maskedWord === this.word;
  }

  getGameStatus() {
    if (this.maskedWord === this.word) {
      return 'You won! The word was: ' + this.word;
    } else if (this.tries >= this.maxTries) {
      return 'Game over! The word was: ' + this.word;
    } else {
      return 'Attempts remaining: ' + (this.maxTries - this.tries) + '\nWord: ' + this.maskedWord;
    }
  }
}

async function getRandomWord(): Promise<string> {
  const response = await request.get(wordUrl);
  const [word] = JSON.parse(response);
  return word;
}

async function playHangman() {
  const word = await getRandomWord();
  const game = new HangmanGame(word, 6);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('Welcome to Hangman!');
  console.log('Try to guess the word:');
  console.log(game.maskedWord);

  rl.on('line', input => {
    game.guessLetter(input);
    console.log(game.getGameStatus());
    if (game.isGameOver()) {
      rl.close();
    }
  });

  rl.on('close', () => {
    console.log('Game over!');
  });
}

playHangman().catch(console.error);
