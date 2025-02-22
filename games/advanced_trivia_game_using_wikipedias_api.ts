//generated with gpt-4o


import fetch from 'node-fetch';
import readline from 'readline-sync';

interface WikiResponse {
  query: {
    random: Array<{
      title: string;
      id: number;
    }>;
    pages: {
      [key: string]: {
        extract?: string;
        links?: Array<{
          title: string;
        }>;
      };
    };
  };
}

class AdvancedTriviaGame {
  private readonly apiUrl: string;
  private score: number;
  private hintsUsed: number;

  constructor() {
    this.apiUrl =
      'https://en.wikipedia.org/w/api.php?action=query&list=random&rnlimit=1&format=json&rnnamespace=0&prop=extracts&exintro=true&explaintext=true';
    this.score = 0;
    this.hintsUsed = 0;
  }

  async getArticleInfo(): Promise<{ title: string; extract: string }> {
    // First, get a random article title
    const randomResponse = await fetch(
      'https://en.wikipedia.org/w/api.php?action=query&list=random&rnlimit=1&format=json&rnnamespace=0'
    );
    const randomData = (await randomResponse.json()) as WikiResponse;
    const articleTitle = randomData.query.random[0].title;

    // Then, fetch the article content using the title
    const contentResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${encodeURIComponent(
        articleTitle
      )}&exintro=true&explaintext=true`
    );
    const contentData = (await contentResponse.json()) as WikiResponse;
    const pageId = Object.keys(contentData.query.pages)[0];
    const articleExtract = contentData.query.pages[pageId]?.extract || '';

    return { title: articleTitle, extract: articleExtract };
  }

  async playGame() {
    console.log('Welcome to the Advanced Wikipedia Trivia Game!');
    console.log('Choose a category or press enter to start a random game.');

    // Levels and categories can be further expanded.
    const categories = ['Science', 'History', 'Technology'];
    const chosenCategory = readline.keyInSelect(categories, 'Select a category:');

    console.log(`You've selected: ${categories[chosenCategory] || 'Random'}`);

    let round = 1;
    while (true) {
      console.log(`\nRound ${round}. Good Luck!\n`);
      
      const articleInfo = await this.getArticleInfo();
      const articleTitle = articleInfo.title;
      const articleExtract = articleInfo.extract;

      console.log(`\n${articleTitle}\n`);
      console.log(articleExtract.substring(0, 300) + '...\n');

      const options = await this.getAnswerOptions(articleTitle);
      console.log('Question: What is the main topic of the article?');
      options.push(articleTitle);
      this.shuffleArray(options);

      for (let i = 0; i < options.length; i++) {
        console.log(`${i + 1}. ${options[i]}`);
      }

      const playerAnswer = this.getPlayerAnswer(options.length);
      const correctAnswer = options.indexOf(articleTitle) + 1;

      console.log(`Your answer: ${playerAnswer}`);
      console.log(`Correct answer: ${correctAnswer}`);

      if (playerAnswer === correctAnswer) {
        console.log('Correct answer! You earn 10 points!');
        this.score += 10;
      } else {
        console.log('Incorrect answer! Better luck next time!');
      }

      this.displayScore();
      if (!readline.keyInYN('Do you want to play another round?')) {
        break;
      }
      round++;
    }

    console.log(`Final Score: ${this.score}`);
  }

  async getAnswerOptions(articleTitle: string): Promise<string[]> {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&prop=links&format=json&titles=${encodeURIComponent(
        articleTitle
      )}`
    );
    const data = (await response.json()) as WikiResponse;
    const links = data.query.pages;
    const pageId = Object.keys(links)[0];
    const linkTitles = links[pageId]?.links?.map(link => link.title) || [];
    return linkTitles.slice(0, 3);
  }

  private getPlayerAnswer(numOptions: number): number {
    let answer = parseInt(readline.question(`Enter the number of your answer (1-${numOptions}): `));

    while (isNaN(answer) || answer < 1 || answer > numOptions) {
      console.log('Invalid input. Please enter a number between 1 and ' + numOptions);
      answer = parseInt(readline.question(`Enter the number of your answer (1-${numOptions}): `));
    }

    return answer;
  }

  private displayScore() {
    console.log(`Current Score: ${this.score}\n`);
  }

  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}

const game = new AdvancedTriviaGame();
game.playGame();
