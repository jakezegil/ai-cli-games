//generated with gpt-4o


import * as readline from 'readline';

class FruitNinja {
  private fruits: string[] = ['🍎', '🍌', '🍉', '🍇', '🍓'];
  private activeFruits: string[] = [];
  private score: number = 0;
  private gameInterval: NodeJS.Timeout | null = null;
  private rl: readline.Interface;
  private isPlaying: boolean = true;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.rl.on('line', (input) => {
      if (input.trim() !== '') {
        this.sliceFruit(input.trim());
      }
    });
  }

  public start() {
    console.log('Welcome to Fruit Ninja!');
    this.gameInterval = setInterval(() => {
      this.spawnFruit();
      this.displayGame();
    }, 1000);
  }

  private spawnFruit() {
    const fruit = this.fruits[Math.floor(Math.random() * this.fruits.length)];
    this.activeFruits.push(fruit);
    if (this.activeFruits.length > 5) {
      this.activeFruits.shift();
    }
  }

  private sliceFruit(input: string) {
    if (this.activeFruits.includes(input)) {
      this.score++;
      this.activeFruits = this.activeFruits.filter(fruit => fruit !== input);
      console.log(`Sliced ${input}! Current score: ${this.score}`);
    } else {
      console.log(`Missed! No ${input} in sight.`);
    }
  }

  private displayGame() {
    console.clear();
    console.log('Fruits: ', this.activeFruits.join(' '));
    console.log('Type the emoji of the fruit to slice it!');

    if (!this.isPlaying) {
      this.endGame();
    }
  }

  private endGame() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      console.log(`Game Over! Your final score is: ${this.score}`);
      this.rl.close();
    }
  }
}

const game = new FruitNinja();
game.start();
