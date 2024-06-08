
class HangmanGame {
  private word: string;
  private guessedLetters: string[];
  private maxWrongGuesses: number;
  private wrongGuesses: number;

  constructor(word: string, maxWrongGuesses: number) {
    this.word = word.toLowerCase();
    this.guessedLetters = [];
    this.maxWrongGuesses = maxWrongGuesses;
    this.wrongGuesses = 0;
  }

  guessLetter(letter: string) {
    letter = letter.toLowerCase();
    if (this.word.includes(letter)) {
      this.guessedLetters.push(letter);
    } else {
      this.wrongGuesses++;
    }
  }

  getWordDisplay() {
    let display = "";
    for (const char of this.word) {
      if (this.guessedLetters.includes(char)) {
        display += char;
      } else {
        display += "_";
      }
    }
    return display;
  }

  isGameOver() {
    return this.isWordGuessed() || this.wrongGuesses >= this.maxWrongGuesses;
  }

  isWordGuessed() {
    for (const char of this.word) {
      if (!this.guessedLetters.includes(char)) {
        return false;
      }
    }
    return true;
  }
}

// Example Usage
const hangman = new HangmanGame("abracadabra", 6);

// Main loop
while (!hangman.isGameOver()) {
  console.clear();
  console.log("Word: " + hangman.getWordDisplay());
  console.log("Wrong Guesses: " + hangman.wrongGuesses + "/" + hangman.maxWrongGuesses);
  const guess = prompt("Guess a letter: ");
  if (guess) {
    hangman.guessLetter(guess);
  }
}

if (hangman.isWordGuessed()) {
  console.log("Congratulations! You guessed the word: " + hangman.getWordDisplay());
} else {
  console.log("Sorry, you ran out of guesses. The word was: " + hangman.word);
}
