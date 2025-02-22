//generated with o1-preview


import * as https from 'https';
import * as readline from 'readline';

// Interface for trivia question
interface TriviaQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

// Function to fetch a random trivia question
function fetchTriviaQuestion(): Promise<TriviaQuestion> {
  return new Promise((resolve, reject) => {
    https.get('https://opentdb.com/api.php?amount=1&type=multiple', (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const jsonData = JSON.parse(data);
        if (jsonData.response_code === 0) {
          const questionData = jsonData.results[0];
          const question: TriviaQuestion = {
            category: questionData.category,
            type: questionData.type,
            difficulty: questionData.difficulty,
            question: decodeHTML(questionData.question),
            correct_answer: decodeHTML(questionData.correct_answer),
            incorrect_answers: questionData.incorrect_answers.map((ans: string) => decodeHTML(ans)),
          };
          resolve(question);
        } else {
          reject('Failed to fetch trivia question.');
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to decode HTML entities in the trivia questions
function decodeHTML(html: string): string {
  const text = html.replace(/&quot;/g, '"')
                   .replace(/&#039;/g, "'")
                   .replace(/&amp;/g, '&')
                   .replace(/&eacute;/g, 'é')
                   .replace(/&ouml;/g, 'ö')
                   .replace(/&rsquo;/g, '’')
                   .replace(/&uuml;/g, 'ü')
                   .replace(/&ldquo;/g, '“')
                   .replace(/&rdquo;/g, '”');
  return text;
}

// Function to ask a question using readline
function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

// Function to shuffle an array (Fisher-Yates Shuffle)
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Main game loop
async function main() {
  let playAgain = true;
  let score = 0;
  let totalQuestions = 0;

  while (playAgain) {
    try {
      const trivia = await fetchTriviaQuestion();
      totalQuestions++;

      // Combine correct and incorrect answers and shuffle them
      const options = [...trivia.incorrect_answers, trivia.correct_answer];
      shuffleArray(options);

      console.log(`\nCategory: ${trivia.category}`);
      console.log(`Difficulty: ${trivia.difficulty}`);
      console.log(`\nQuestion ${totalQuestions}: ${trivia.question}\n`);

      options.forEach((option, index) => {
        console.log(`${index + 1}: ${option}`);
      });

      const answer = await askQuestion('\nYour answer (enter the number): ');
      const userChoice = parseInt(answer);

      if (options[userChoice - 1] === trivia.correct_answer) {
        console.log('\n🎉 Correct!\n');
        score++;
      } else {
        console.log(`\n❌ Wrong! The correct answer was: ${trivia.correct_answer}\n`);
      }

      const again = await askQuestion('Do you want to play again? (yes/no): ');
      playAgain = again.toLowerCase().startsWith('y');
    } catch (error) {
      console.error('An error occurred:', error);
      break;
    }
  }

  console.log(`\nGame Over! Your final score is ${score} out of ${totalQuestions}.\n`);
}

// Start the game
main();
