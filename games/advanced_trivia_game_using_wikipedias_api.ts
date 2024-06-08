
import fetch from 'node-fetch';

class TriviaGame {
  apiUrl: string;

  constructor() {
    this.apiUrl = 'https://en.wikipedia.org/w/api.php?action=query&list=random&rnlimit=1&format=json&rnnamespace=0&prop=extracts&exintro=true&explaintext=true';
  }

  async getArticleInfo(): Promise<{ title: string, extract: string }> {
    const response = await fetch(this.apiUrl);
    const data = await response.json();
    const articleTitle = data.query.random[0].title;
    const articleExtract = data.query.pages[data.query.random[0].id].extract;
    return { title: articleTitle, extract: articleExtract };
  }

  async playGame() {
    console.log('Welcome to the Wikipedia Trivia Game!');
    console.log('Answer the following questions based on Wikipedia articles.');

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
      console.log('Correct answer! You win!');
    } else {
      console.log('Incorrect answer! Better luck next time!');
    }
  }

  async getAnswerOptions(articleTitle: string): Promise<string[]> {
    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=links&format=json&titles=${encodeURIComponent(articleTitle)}`);
    const data = await response.json();
    const links = data.query.pages;
    const pageId = Object.keys(links)[0];
    const linkTitles = links[pageId].links.map((link: { title: string }) => link.title);
    return linkTitles.slice(0, 3);
  }

  getPlayerAnswer(numOptions: number): number {
    const readline = require('readline-sync');
    let answer = parseInt(readline.question(`Enter the number of your answer (1-${numOptions}): `));

    while (isNaN(answer) || answer < 1 || answer > numOptions) {
      console.log('Invalid input. Please enter a number between 1 and ' + numOptions);
      answer = parseInt(readline.question(`Enter the number of your answer (1-${numOptions}): `));
    }

    return answer;
  }

  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}

const game = new TriviaGame();
game.playGame();
