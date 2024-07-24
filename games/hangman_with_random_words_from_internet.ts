
import axios from 'axios';
import readlineSync from 'readline-sync';

async function fetchRandomWord(): Promise<string> {
    const response = await axios.get('https://random-word-api.herokuapp.com/word?number=1');
    return response.data[0];
}

function renderWord(word: string, guessedLetters: Set<string>): string {
    return word.split('').map(letter => (guessedLetters.has(letter) ? letter : '_')).join(' ');
}

async function playHangman() {
    const word = await fetchRandomWord();
    const guessedLetters = new Set<string>();
    let attemptsLeft = 6;
    let gameWon = false;

    console.log("Welcome to Hangman!");
    console.log(`The word has ${word.length} letters.`);
    
    while (attemptsLeft > 0 && !gameWon) {
        console.log(`\nAttempts left: ${attemptsLeft}`);
        console.log(renderWord(word, guessedLetters));
        
        const guess = readlineSync.question('Guess a letter: ').toLowerCase();

        if (guessedLetters.has(guess)) {
            console.log(`You already guessed "${guess}". Try another letter.`);
            continue;
        }

        guessedLetters.add(guess);

        if (word.includes(guess)) {
            console.log(`Good guess: "${guess}"`);
        } else {
            attemptsLeft--;
            console.log(`Wrong guess: "${guess}".`);
        }

        gameWon = word.split('').every(letter => guessedLetters.has(letter));
    }

    if (gameWon) {
        console.log(`Congratulations! You've guessed the word: "${word}"`);
    } else {
        console.log(`Game over! The word was: "${word}"`);
    }
}

playHangman().catch(err => console.error(err));
