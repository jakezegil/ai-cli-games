//generated with gpt-4o-mini


import axios from 'axios';
import * as rl from 'readline';

const wordLength = 5;
const maxAttempts = 6;
const apiUrl = "https://random-word-api.herokuapp.com/api/v1/words?number=100&swear=0&number=1"; // API to get random words

const readline = rl.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function fetchWord(): Promise<string> {
  const response = await axios.get(apiUrl);
  const words: string[] = response.data as string[]; // Handle the response as an array of strings
  const randomWord = words[0]; // Pick the first word
  return randomWord.toLowerCase();
}

function renderAttempts(attempts: Array<string>, hints: Array<string>, currentAttempt: string) {
  console.log("\nAttempts:");
  attempts.forEach((attempt, index) => {
    console.log(`Attempt ${index + 1}: ${attempt} - Hints: ${hints[index]}`);
  });
  console.log(`\nCurrent Attempt: ${currentAttempt}`);
}

async function startGame() {
  const secretWord = await fetchWord();

  let attempts: string[] = [];
  let hints: string[] = [];
  let currentAttempt = '';

  console.log("Welcome to Turbo Wordle!");
  console.log(`Guess the ${wordLength}-letter word. You have ${maxAttempts} attempts.`);
  
  for (let attemptsCount = 0; attemptsCount < maxAttempts; attemptsCount++) {
    renderAttempts(attempts, hints, currentAttempt);

    currentAttempt = await new Promise<string>(resolve => {
      readline.question('Enter your guess: ', (input) => {
        resolve(input.toLowerCase());
      });
    });

    if (currentAttempt.length !== wordLength) {
      console.log(`Please enter a ${wordLength}-letter word.`);
      attemptsCount--;
      continue;
    }

    attempts.push(currentAttempt);
    const result = getHints(secretWord, currentAttempt);
    hints.push(result);

    if (currentAttempt === secretWord) {
      console.log(`Congratulations! You've guessed the word: ${secretWord}`);
      readline.close();
      return;
    } else {
      console.log(`Hints: ${result}`);
    }

    const remainingAttempts = maxAttempts - attemptsCount - 1;
    if (remainingAttempts === 0) {
      console.log(`Game Over! The secret word was: ${secretWord}`);
    } else {
      console.log(`You have ${remainingAttempts} attempts left. Keep trying!`);
    }
  }

  readline.close();
}

function getHints(secret: string, guess: string): string {
  let hint = '';

  for (let i = 0; i < wordLength; i++) {
    if (guess[i] === secret[i]) {
      hint += guess[i].toUpperCase(); // Correct letter in correct position
    } else if (secret.includes(guess[i])) {
      hint += guess[i].toLowerCase(); // Correct letter in wrong position
    } else {
      hint += '_'; // Incorrect letter
    }
  }

  return hint;
}

async function main() {
  while (true) {
    await startGame();
    const replay = await new Promise<string>(resolve => {
      readline.question('Do you want to play again? (yes/no): ', resolve);
    });
    if (replay.toLowerCase() !== 'yes') {
      console.log("Thanks for playing! Goodbye.");
      break;
    }
  }
}

main().catch(err => {
  console.error('Error fetching word:', err);
});
