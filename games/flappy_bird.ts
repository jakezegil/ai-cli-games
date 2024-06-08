
import * as readline from 'readline';

class FlappyBirdGame {
  private score: number;
  private birdPosition: number;
  private isGameOver: boolean;

  constructor() {
    this.score = 0;
    this.birdPosition = 5;
    this.isGameOver = false;
  }

  startGame() {
    this.renderGame();
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.on('line', (input: string) => {
      if (input.toLowerCase() === 'jump') {
        this.jump();
      }
    });

    this.mainLoop();
  }

  jump() {
    this.birdPosition -= 2;
  }

  mainLoop() {
    setInterval(() => {
      if (this.isGameOver) {
        console.log('Game over! Your score: ' + this.score);
        process.exit(0);
      } else {
        this.birdPosition += 1;
        this.score += 1;
        this.renderGame();
      }
    }, 200);
  }

  renderGame() {
    console.clear();
    console.log('Flappy Bird - Score: ' + this.score + '\n');
    for (let i = 0; i < 10; i++) {
      if (i === this.birdPosition) {
        process.stdout.write('===|o|===\n');
      } else {
        process.stdout.write('         \n');
      }
    }
    console.log('---------');
    console.log('Press "jump" to make the bird jump!');
  }
}

const game = new FlappyBirdGame();
game.startGame();
