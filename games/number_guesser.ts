
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function main() {
  console.log('Welcome to Guess the Number game!');
  const secretNumber = randomNumber(1, 100);
  let attempts = 0;

  function askForNumber() {
    rl.question('Try to guess the number (between 1 and 100): ', (input) => {
      const guess = parseInt(input, 10);
      attempts++;

      if (isNaN(guess) || guess < 1 || guess > 100) {
        console.log('Please enter a valid number between 1 and 100');
      } else if (guess < secretNumber) {
        console.log('Too low! Try again.');
        askForNumber();
      } else if (guess > secretNumber) {
        console.log('Too high! Try again.');
        askForNumber();
      } else {
        console.log(`Congratulations! You guessed the number in ${attempts} attempts.`);
        rl.close();
      }
    });
  }

  askForNumber();
}

main();
