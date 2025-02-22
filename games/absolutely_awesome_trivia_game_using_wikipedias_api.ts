//generated with o1-preview


import * as readline from 'readline';
import { get } from 'https';

interface Question {
  question: string;
  answer: string;
}

class WikipediaTriviaGame {
  private rl: readline.Interface;
  private score: number = 0;
  private totalQuestions: number = 5;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  public start() {
    console.log('Welcome to the Absolutely Awesome Wikipedia Trivia Game!');
    this.askQuestion(0);
  }

  private askQuestion(currentQuestion: number) {
    if (currentQuestion >= this.totalQuestions) {
      console.log(`Game over! Your final score is: ${this.score}/${this.totalQuestions}`);
      this.rl.close();
      return;
    }

    this.generateQuestion().then((q: Question) => {
      console.log(`Question ${currentQuestion + 1}: ${q.question}`);
      this.rl.question('Your answer: ', (answer: string) => {
        if (answer.trim().toLowerCase() === q.answer.trim().toLowerCase()) {
          console.log('Correct!\n');
          this.score++;
        } else {
          console.log(`Incorrect! The correct answer was: ${q.answer}\n`);
        }
        this.askQuestion(currentQuestion + 1);
      });
    }).catch((err) => {
      console.error('Error generating question:', err);
      this.rl.close();
    });
  }

  private generateQuestion(): Promise<Question> {
    return new Promise((resolve, reject) => {
      const options = ['birthDate', 'deathDate', 'birthPlace', 'capital'];
      const randomOption = options[Math.floor(Math.random() * options.length)];
      
      // Use MediaWiki API instead of REST API
      const url = 'https://en.wikipedia.org/w/api.php?' + 
        'action=query&format=json&generator=random&grnnamespace=0&prop=extracts|info&exintro=1&origin=*';

      get(url, {
        headers: {
          'User-Agent': 'WikipediaTriviaGame/1.0 (https://github.com/yourusername/trivia-game)'
        }
      }, (res) => {
        let data = '';

        res.on('data', (chunk: Buffer) => {
          data += chunk.toString();
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            const pages = response.query?.pages;
            if (!pages) {
              throw new Error('No pages returned from Wikipedia API');
            }

            const page = Object.values(pages)[0] as any;
            const title = page.title;
            const extract = page.extract.replace(/<\/?[^>]+(>|$)/g, ''); // Remove HTML tags

            // Rest of the parsing logic remains the same
            let question: string = '';
            let answer: string = '';

            switch (randomOption) {
              case 'birthDate':
                const birthDateMatch = extract.match(/born\s+(\w+\s+\d{1,2},\s+\d{4})/i);
                if (birthDateMatch) {
                  question = `When was ${title} born?`;
                  answer = birthDateMatch[1];
                }
                break;
              case 'deathDate':
                const deathDateMatch = extract.match(/died\s+(\w+\s+\d{1,2},\s+\d{4})/i);
                if (deathDateMatch) {
                  question = `When did ${title} die?`;
                  answer = deathDateMatch[1];
                }
                break;
              case 'birthPlace':
                const birthPlaceMatch = extract.match(/born\s+(?:on\s+\w+\s+\d{1,2},\s+\d{4},\s+)?in\s+([^\.\,]+)/i);
                if (birthPlaceMatch) {
                  question = `Where was ${title} born?`;
                  answer = birthPlaceMatch[1];
                }
                break;
              case 'capital':
                if (extract.includes(' is the capital ')) {
                  question = `Which country has ${title} as its capital?`;
                  const capitalMatch = extract.match(/capital\s+of\s+([^\.\,]+)/i);
                  if (capitalMatch) {
                    answer = capitalMatch[1];
                  }
                }
                break;
            }

            if (question && answer) {
              resolve({ question, answer });
            } else {
              // If we couldn't generate a question from this article, try again
              this.generateQuestion().then(resolve).catch(reject);
            }
          } catch (error) {
            console.error('Error parsing Wikipedia response:', error);
            // Try again with a new request
            this.generateQuestion().then(resolve).catch(reject);
          }
        });
      }).on('error', (err) => {
        console.error('Network error:', err);
        reject(err);
      });
    });
  }
}

const game = new WikipediaTriviaGame();
game.start();
